import { FileIcon, FolderIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell } from "@/components/ui/table";
import { formatBytes, formatDateTime } from "./format";
import type { Row } from "./types";

// Presentational cells with no state of their own - the row above owns click/selection
// handlers and passes them down, so only cells that manage their own state (the actions
// menu's dropdown + confirm dialog) need "use client".

export function SelectCell({
	checked,
	label,
	onCheckedChange,
}: {
	checked: boolean;
	label: string;
	onCheckedChange: () => void;
}) {
	return (
		<TableCell>
			<Checkbox
				aria-label={label}
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</TableCell>
	);
}

export function NameCell({ row, onOpen }: { row: Row; onOpen: () => void }) {
	const Icon = row.type === "folder" ? FolderIcon : FileIcon;

	return (
		<TableCell>
			<button
				className="flex max-w-full items-center gap-2 text-left hover:underline"
				onClick={onOpen}
				type="button"
			>
				<Icon className="size-4 shrink-0 text-muted-foreground" />
				<span className="truncate">{row.name}</span>
			</button>
		</TableCell>
	);
}

export function TypeCell({ row, folderLabel }: { row: Row; folderLabel: string }) {
	return (
		<TableCell className="text-muted-foreground">
			{row.type === "folder" ? folderLabel : (row.mime_type ?? "-")}
		</TableCell>
	);
}

export function SizeCell({ row }: { row: Row }) {
	return <TableCell className="text-muted-foreground">{row.type === "folder" ? "-" : formatBytes(row.size)}</TableCell>;
}

export function DateCell({ date }: { date: Date }) {
	return <TableCell className="text-muted-foreground">{formatDateTime(date)}</TableCell>;
}
