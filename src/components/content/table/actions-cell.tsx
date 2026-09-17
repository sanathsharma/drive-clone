"use client";

import { DownloadIcon, InfoIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import * as fileActions from "@/actions/files";
import * as folderActions from "@/actions/folders";
import { RenameDialog } from "@/components/content/rename-dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { navigateForDownload, triggerDownload } from "@/lib/trigger-download";
import { formatBytes, formatDateTime } from "./format";
import type { Row } from "./types";

type Props = {
	row: Row;
	parentId?: string;
};

export function ActionsCell({ row, parentId }: Props) {
	const t = useTranslations("content");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const onConfirmDelete = () => {
		startTransition(async () => {
			const { error } =
				row.type === "folder"
					? await folderActions.deleteFolder(row.id, parentId)
					: await fileActions.deleteFile(row.id, parentId);

			setConfirmOpen(false);

			if (error) {
				toast.add({ title: t("delete-dialog.delete-failed", { name: row.name }), type: "error" });
				return;
			}

			toast.add({ title: t("delete-dialog.deleted", { name: row.name }), type: "success" });
		});
	};

	const onDownload = () => {
		if (row.type === "file") {
			navigateForDownload(`/api/files/${row.id}?download`);
			return;
		}

		startTransition(async () => {
			try {
				await toast.promise(
					triggerDownload({
						fallbackFilename: `${row.name}.zip`,
						items: [{ id: row.id, type: "folder" }],
					}),
					{
						error: () => t("download.failed", { name: row.name }),
						loading: t("download.preparing"),
						success: () => t("download.downloaded", { name: row.name }),
					},
				);
			} catch {
				// toast.promise already surfaced the error toast.
			}
		});
	};

	return (
		<TableCell>
			<div className="flex items-center gap-1">
				<Button
					aria-label={t("table.view-details")}
					className="md:hidden"
					onClick={() => setDetailsOpen(true)}
					size="icon-sm"
					title={t("table.view-details")}
					variant="ghost"
				>
					<InfoIcon />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								aria-label={t("table.open-menu")}
								size="icon-sm"
								title={t("table.open-menu")}
								variant="ghost"
							>
								<MoreHorizontalIcon />
							</Button>
						}
					/>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onDownload}>
							<DownloadIcon />
							{t("table.download")}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setRenameOpen(true)}>
							<PencilIcon />
							{t("table.rename")}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setConfirmOpen(true)}
							variant="destructive"
						>
							<Trash2Icon />
							{t("table.delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Dialog
				onOpenChange={setDetailsOpen}
				open={detailsOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{row.name}</DialogTitle>
					</DialogHeader>

					<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
						<dt className="text-muted-foreground">{t("table.type")}</dt>
						<dd className="truncate">{row.type === "folder" ? t("table.type-folder") : (row.mime_type ?? "-")}</dd>
						<dt className="text-muted-foreground">{t("table.size")}</dt>
						<dd>{row.type === "folder" ? "-" : formatBytes(row.size)}</dd>
						<dt className="text-muted-foreground">{t("table.created")}</dt>
						<dd>{formatDateTime(row.created_at)}</dd>
						<dt className="text-muted-foreground">{t("table.updated")}</dt>
						<dd>{formatDateTime(row.updated_at)}</dd>
					</dl>
				</DialogContent>
			</Dialog>

			<RenameDialog
				onOpenChange={setRenameOpen}
				open={renameOpen}
				parentId={parentId}
				row={row}
			/>

			<AlertDialog
				onOpenChange={setConfirmOpen}
				open={confirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("delete-dialog.title-single", { name: row.name })}</AlertDialogTitle>
						<AlertDialogDescription>
							{row.type === "folder" ? t("delete-dialog.description-folder") : t("delete-dialog.description-file")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("delete-dialog.cancel")}</AlertDialogCancel>
						<AlertDialogAction
							disabled={isPending}
							onClick={onConfirmDelete}
							variant="destructive"
						>
							{isPending ? t("delete-dialog.deleting") : t("delete-dialog.confirm")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</TableCell>
	);
}