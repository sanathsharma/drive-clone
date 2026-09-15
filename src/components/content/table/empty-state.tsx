"use client";

import { GhostIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContentArea } from "@/components/content/area";
import { CreateFolderDialog } from "@/components/content/create-folder-dialog";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

type Props = {
	parentId?: string;
};

export function ContentEmptyState({ parentId }: Props) {
	const t = useTranslations("content.table");
	const area = useContentArea();

	return (
		<Empty className="h-full border-none">
			<EmptyMedia variant="icon">
				<GhostIcon />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>{t("empty-title")}</EmptyTitle>
				<EmptyDescription>{t("empty-description")}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button
						onClick={() => area?.openFilePicker()}
						variant="outline"
					>
						{t("upload-cta")}
					</Button>
					<CreateFolderDialog
						parentId={parentId}
						trigger="text"
					/>
				</div>
			</EmptyContent>
		</Empty>
	);
}