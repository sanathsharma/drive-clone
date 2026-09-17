"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useContentArea } from "@/components/content/area";
import { Table, TableBody, TableCell, TableColGroup, type TableColWidth, TableRow } from "@/components/ui/table";
import type { File, Folder } from "@/db/schema";
import { ACTIONS_COL_CLASS, COLUMN_RATIO_TOTAL, DATA_COLUMN_WIDTHS, MOBILE_HIDDEN_COL_CLASS } from "./columns";
import { ContentEmptyState } from "./empty-state";
import { ContentTableHeader } from "./header";
import { ContentTableRow } from "./row";
import type { Row, SortKey, SortState } from "./types";

type Props = {
	files: File[];
	folders: Folder[];
	parentId?: string;
};

function compareRows(a: Row, b: Row, key: SortKey) {
	if (key === "name") {
		return a.name.localeCompare(b.name);
	}
	return a[key].getTime() - b[key].getTime();
}

export function ContentTable({ files, folders, parentId }: Props) {
	const t = useTranslations("content.table");
	const area = useContentArea();
	const [sort, setSort] = useState<SortState>({ direction: "asc", key: "name" });

	const allRows = useMemo<Row[]>(() => {
		const folderRows: Row[] = folders.map((folder) => ({ ...folder, type: "folder" as const }));
		const fileRows: Row[] = files.map((file) => ({ ...file, type: "file" as const }));

		const sortGroup = (group: Row[]) =>
			[...group].sort((a, b) => {
				const compared = compareRows(a, b, sort.key);
				return sort.direction === "asc" ? compared : -compared;
			});

		return [...sortGroup(folderRows), ...sortGroup(fileRows)];
	}, [files, folders, sort]);

	if (allRows.length === 0) {
		return <ContentEmptyState parentId={parentId} />;
	}

	const search = area?.search.trim().toLowerCase() ?? "";
	const rows = search ? allRows.filter((row) => row.name.toLowerCase().includes(search)) : allRows;

	const onSortChange = (key: SortKey) => {
		setSort((prev) => {
			if (prev.key === key) {
				return { direction: prev.direction === "asc" ? "desc" : "asc", key };
			}
			return { direction: key === "name" ? "asc" : "desc", key };
		});
	};

	const onToggleSelectAll = () => {
		area?.toggleSelectAll(rows.map((row) => ({ id: row.id, type: row.type })));
	};

	const widths: TableColWidth[] = [...(area?.selectMode ? (["auto"] as const) : []), ...DATA_COLUMN_WIDTHS, "auto"];
	// Name and the actions column stay visible on mobile; Type/Size/Created/Updated hide below `sm`.
	const colClassNames: (string | undefined)[] = [
		...(area?.selectMode ? [undefined] : []),
		undefined,
		MOBILE_HIDDEN_COL_CLASS,
		MOBILE_HIDDEN_COL_CLASS,
		MOBILE_HIDDEN_COL_CLASS,
		MOBILE_HIDDEN_COL_CLASS,
		ACTIONS_COL_CLASS,
	];

	return (
		<Table className="table-fixed">
			<TableColGroup
				classNames={colClassNames}
				total={COLUMN_RATIO_TOTAL}
				widths={widths}
			/>
			<ContentTableHeader
				onSortChange={onSortChange}
				onToggleSelectAll={onToggleSelectAll}
				rows={rows}
				sort={sort}
			/>
			<TableBody>
				{rows.length === 0 ? (
					<TableRow>
						<TableCell
							className="h-24 text-center text-muted-foreground"
							colSpan={area?.selectMode ? 7 : 6}
						>
							{t("search-empty", { query: area?.search ?? "" })}
						</TableCell>
					</TableRow>
				) : (
					rows.map((row) => (
						<ContentTableRow
							key={row.id}
							parentId={parentId}
							row={row}
						/>
					))
				)}
			</TableBody>
		</Table>
	);
}
