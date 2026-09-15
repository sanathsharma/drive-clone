"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { getFileOpenUrl } from "@/actions/files";
import { useContentArea } from "@/components/content/area";
import { TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { paths } from "@/constants/paths";
import { useRouter } from "@/i18n/navigation";
import { ActionsCell } from "./actions-cell";
import { DateCell, NameCell, SelectCell, SizeCell, TypeCell } from "./cells";
import type { Row } from "./types";

type Props = {
	row: Row;
	parentId?: string;
};

export function ContentTableRow({ row, parentId }: Props) {
	const t = useTranslations("content");
	const router = useRouter();
	const area = useContentArea();
	const [, startTransition] = useTransition();

	const onOpen = () => {
		if (row.type === "folder") {
			router.push(paths.folder(row.id));
			return;
		}

		startTransition(async () => {
			const { url, error } = await getFileOpenUrl(row.id);
			if (error || !url) {
				toast.add({ title: t("open-file.failed", { name: row.name }), type: "error" });
				return;
			}

			window.open(url, "_blank", "noopener,noreferrer");
		});
	};

	return (
		<TableRow>
			{area?.selectMode && (
				<SelectCell
					checked={area.selected.has(row.id)}
					label={t("table.select-row", { name: row.name })}
					onCheckedChange={() => area.toggleSelected(row.id, row.type)}
				/>
			)}
			<NameCell
				onOpen={onOpen}
				row={row}
			/>
			<TypeCell
				folderLabel={t("table.type-folder")}
				row={row}
			/>
			<SizeCell row={row} />
			<DateCell date={row.created_at} />
			<DateCell date={row.updated_at} />
			<ActionsCell
				parentId={parentId}
				row={row}
			/>
		</TableRow>
	);
}
