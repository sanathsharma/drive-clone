"use client";

import { UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContentArea } from "@/components/content/area";
import { CreateFolderDialog } from "@/components/content/create-folder-dialog";
import { DeleteSelectedButton } from "@/components/content/delete-selected-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

type Props = {
	parentId?: string;
};

export function ActionsPanel({ parentId }: Props) {
	const t = useTranslations("content.actions-panel");
	const area = useContentArea();

	if (!area) {
		return null;
	}

	return (
		<div className="flex shrink-0 items-center gap-1.5">
			<CreateFolderDialog parentId={parentId} />

			<Button
				aria-label={t("upload")}
				onClick={area.openFilePicker}
				size="icon-sm"
				variant="outline"
			>
				<UploadIcon />
			</Button>

			<Separator
				className="h-7"
				orientation="vertical"
			/>

			<Toggle
				onPressedChange={area.toggleSelectMode}
				pressed={area.selectMode}
				size="sm"
				variant="outline"
			>
				{area.selectMode ? t("cancel-select") : t("select")}
			</Toggle>

			{area.selectMode && area.selected.size > 0 && <DeleteSelectedButton parentId={parentId} />}
		</div>
	);
}
