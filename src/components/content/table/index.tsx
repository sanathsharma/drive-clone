"use client";

import { useMemo, useState } from "react";
import { useContentArea } from "@/components/content/area";
import { Table, TableBody } from "@/components/ui/table";
import type { File, Folder } from "@/db/schema";
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
	const area = useContentArea();
	const [sort, setSort] = useState<SortState>({ direction: "asc", key: "name" });

	const rows = useMemo<Row[]>(() => {
		const folderRows: Row[] = folders.map((folder) => ({ ...folder, type: "folder" as const }));
		const fileRows: Row[] = files.map((file) => ({ ...file, type: "file" as const }));

		const sortGroup = (group: Row[]) =>
			[...group].sort((a, b) => {
				const compared = compareRows(a, b, sort.key);
				return sort.direction === "asc" ? compared : -compared;
			});

		return [...sortGroup(folderRows), ...sortGroup(fileRows)];
	}, [files, folders, sort]);

	if (rows.length === 0) {
		return <ContentEmptyState parentId={parentId} />;
	}

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

	return (
		<Table>
			<ContentTableHeader
				onSortChange={onSortChange}
				onToggleSelectAll={onToggleSelectAll}
				rows={rows}
				sort={sort}
			/>
			<TableBody>
				{rows.map((row) => (
					<ContentTableRow
						key={row.id}
						parentId={parentId}
						row={row}
					/>
				))}
			</TableBody>
		</Table>
	);
}
