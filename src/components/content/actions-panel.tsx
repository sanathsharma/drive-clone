"use client";

import { SearchIcon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContentArea } from "@/components/content/area";
import { CreateFolderDialog } from "@/components/content/create-folder-dialog";
import { DeleteSelectedButton } from "@/components/content/delete-selected-button";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
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
			<InputGroup className="w-48">
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<InputGroupInput
					aria-label={t("search")}
					onChange={(event) => area.setSearch(event.target.value)}
					placeholder={t("search")}
					value={area.search}
				/>
			</InputGroup>

			<CreateFolderDialog parentId={parentId} />
			<Button
				aria-label={t("upload")}
				onClick={area.openFilePicker}
				size="icon"
				variant="outline"
			>
				<UploadIcon />
			</Button>

			<Separator
				className="h-8"
				orientation="vertical"
			/>

			<Toggle
				onPressedChange={area.toggleSelectMode}
				pressed={area.selectMode}
				variant="outline"
			>
				{area.selectMode ? t("cancel-select") : t("select")}
			</Toggle>

			{area.selectMode && area.selected.size > 0 && <DeleteSelectedButton parentId={parentId} />}
		</div>
	);
}