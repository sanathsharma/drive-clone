"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContentArea } from "@/components/content/area";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOBILE_HIDDEN_CELL_CLASS } from "./columns";
import type { Row, SortKey, SortState } from "./types";

type SortableHeadProps = {
	label: string;
	sortKey: SortKey;
	sort: SortState;
	onSortChange: (key: SortKey) => void;
	className?: string;
};

function SortableHead({ label, sortKey, sort, onSortChange, className }: SortableHeadProps) {
	const isActive = sort.key === sortKey;
	const DirectionIcon = sort.direction === "asc" ? ArrowUpIcon : ArrowDownIcon;

	return (
		<TableHead className={className}>
			<button
				className="flex w-full items-center justify-between gap-1 text-left rounded-xs focus-visible:c_outline-2"
				onClick={() => onSortChange(sortKey)}
				type="button"
			>
				{label}
				{isActive && <DirectionIcon className="size-3.5 text-muted-foreground" />}
			</button>
		</TableHead>
	);
}

type Props = {
	rows: Row[];
	sort: SortState;
	onSortChange: (key: SortKey) => void;
	onToggleSelectAll: () => void;
};

export function ContentTableHeader({ rows, sort, onSortChange, onToggleSelectAll }: Props) {
	const t = useTranslations("content.table");
	const area = useContentArea();

	const selectedCount = area ? rows.filter((row) => area.selected.has(row.id)).length : 0;
	const allSelected = rows.length > 0 && selectedCount === rows.length;
	const someSelected = selectedCount > 0 && !allSelected;

	return (
		<TableHeader className="sticky top-0 z-10 bg-background">
			<TableRow>
				{area?.selectMode && (
					<TableHead className="w-8">
						<Checkbox
							aria-label={t("select-all")}
							checked={allSelected}
							indeterminate={someSelected}
							onCheckedChange={onToggleSelectAll}
						/>
					</TableHead>
				)}
				<SortableHead
					label={t("name")}
					onSortChange={onSortChange}
					sort={sort}
					sortKey="name"
				/>
				<TableHead className={MOBILE_HIDDEN_CELL_CLASS}>{t("type")}</TableHead>
				<TableHead className={MOBILE_HIDDEN_CELL_CLASS}>{t("size")}</TableHead>
				<SortableHead
					className={MOBILE_HIDDEN_CELL_CLASS}
					label={t("created")}
					onSortChange={onSortChange}
					sort={sort}
					sortKey="created_at"
				/>
				<SortableHead
					className={MOBILE_HIDDEN_CELL_CLASS}
					label={t("updated")}
					onSortChange={onSortChange}
					sort={sort}
					sortKey="updated_at"
				/>
				<TableHead className="w-8" />
			</TableRow>
		</TableHeader>
	);
}
