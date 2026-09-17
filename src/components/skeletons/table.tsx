import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
	/** A `TableColGroup` (or other `<colgroup>`/`<caption>` content) rendered before the header. */
	children?: React.ReactNode;
	columnCount: number;
	rowCount: number;
	/** One class name per column, in column order - e.g. to mirror the real table's responsive column hiding. */
	columnClassNames?: (string | undefined)[];
};

export function SkeletonTable({ children, columnCount, rowCount, columnClassNames }: Props) {
	const columns = Array.from({ length: columnCount });
	const rows = Array.from({ length: rowCount });

	return (
		<Table>
			{children}
			<TableHeader className="sticky top-0 z-10 bg-background">
				<TableRow>
					{columns.map((_, index) => (
						<TableHead
							className={columnClassNames?.[index]}
							// biome-ignore lint/suspicious/noArrayIndexKey: a <col> at position `index` always governs the table's `index`-th column - the index is its actual identity, and this list never reorders
							key={index}
						>
							<Skeleton className="h-4 w-full" />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((_, rowIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of placeholder rows, never reordered
					<TableRow key={rowIndex}>
						{columns.map((_, columnIndex) => (
							<TableCell
								className={columnClassNames?.[columnIndex]}
								// biome-ignore lint/suspicious/noArrayIndexKey: a <col> at position `index` always governs the table's `index`-th column - the index is its actual identity, and this list never reorders
								key={columnIndex}
							>
								<Skeleton className="h-4 w-full" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
