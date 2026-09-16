import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = {
	/** A `TableColGroup` (or other `<colgroup>`/`<caption>` content) rendered before the header. */
	children?: React.ReactNode;
	columnCount: number;
	rowCount: number;
};

export function SkeletonTable({ children, columnCount, rowCount }: Props) {
	const columns = Array.from({ length: columnCount });
	const rows = Array.from({ length: rowCount });

	return (
		<Table>
			{children}
			<TableHeader>
				<TableRow>
					{columns.map((_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of placeholder columns, never reordered
						<TableHead key={index}>
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
							// biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of placeholder columns, never reordered
							<TableCell key={columnIndex}>
								<Skeleton className="h-4 w-full" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
