"use client";

import { cn } from "cn";
import type * as React from "react";

function TableContainer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("relative w-full overflow-x-auto", className)}
			data-slot="table-container"
			{...props}
		/>
	);
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<table
			className={cn("w-full caption-bottom text-sm", className)}
			data-slot="table"
			{...props}
		/>
	);
}

/**
 * A width for one `<col>`: a ratio unit (normalized against `total`), `"auto"` to defer to
 * whatever width the column's own `<th>`/`<td>` cells declare, or any other string as a literal
 * CSS width (e.g. `"2rem"`, `"48px"`).
 */
export type TableColWidth = number | "auto" | string;

type TableColGroupProps = {
	/** One entry per `<col>`, in column order. */
	widths: TableColWidth[];
	/** Denominator for the ratio math: a numeric entry renders as `${entry / total * 100}%`. */
	total: number;
};

function TableColGroup({ widths, total }: TableColGroupProps) {
	return (
		<colgroup data-slot="table-colgroup">
			{widths.map((width, index) => {
				const style =
					typeof width === "number" ? { width: `${(width / total) * 100}%` } : width === "auto" ? undefined : { width };

				return (
					<col
						// biome-ignore lint/suspicious/noArrayIndexKey: a <col> at position `index` always governs the table's `index`-th column - the index is its actual identity, and this list never reorders
						key={index}
						style={style}
					/>
				);
			})}
		</colgroup>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			className={cn("[&_tr]:border-b border-border", className)}
			data-slot="table-header"
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			className={cn("[&_tr:last-child]:border-0", className)}
			data-slot="table-body"
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
			data-slot="table-footer"
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			className={cn(
				"border-b border-border transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			data-slot="table-row"
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			className={cn(
				"h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0",
				className,
			)}
			data-slot="table-head"
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
			data-slot="table-cell"
			{...props}
		/>
	);
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
	return (
		<caption
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			data-slot="table-caption"
			{...props}
		/>
	);
}

export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableColGroup,
	TableContainer,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
};
