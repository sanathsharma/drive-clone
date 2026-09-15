"use client";

import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { deleteSelection } from "@/actions/content";
import { useContentArea } from "@/components/content/area";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Props = {
	parentId?: string;
};

export function DeleteSelectedButton({ parentId }: Props) {
	const t = useTranslations("content.delete-dialog");
	const area = useContentArea();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	if (!area) {
		return null;
	}

	const count = area.selected.size;

	const onConfirm = () => {
		const items = Array.from(area.selected, ([id, type]) => ({ id, type }));

		startTransition(async () => {
			const { error } = await deleteSelection(items, parentId);
			setOpen(false);

			if (error) {
				toast.add({ title: t("delete-selected-failed"), type: "error" });
				return;
			}

			toast.add({ title: t("deleted-count", { count }), type: "success" });
			area.exitSelectMode();
		});
	};

	return (
		<AlertDialog
			onOpenChange={setOpen}
			open={open}
		>
			<AlertDialogTrigger
				render={
					<Button
						size="sm"
						variant="destructive"
					>
						<Trash2Icon />
						{t("delete-count", { count })}
					</Button>
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("title-bulk", { count })}</AlertDialogTitle>
					<AlertDialogDescription>{t("description-bulk")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						onClick={onConfirm}
						variant="destructive"
					>
						{isPending ? t("deleting") : t("confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
