"use client";

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { Row } from "./types";

type Props = {
	row: Row;
	parentId?: string;
};

export function ActionsCell({ row, parentId }: Props) {
	const t = useTranslations("content");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);
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

	return (
		<TableCell>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							aria-label={t("table.open-menu")}
							size="icon-sm"
							variant="ghost"
						>
							<MoreHorizontalIcon />
						</Button>
					}
				/>
				<DropdownMenuContent align="end">
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
