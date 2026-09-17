import { Container } from "@/components/content/container";
import {
	ACTIONS_COL_CLASS,
	COLUMN_RATIO_TOTAL,
	DATA_COLUMN_WIDTHS,
	MOBILE_HIDDEN_CELL_CLASS,
	MOBILE_HIDDEN_COL_CLASS,
} from "@/components/content/table/columns";
import {
	SkeletonBreadcrumb,
	SkeletonButton,
	SkeletonIconButton,
	SkeletonInput,
	SkeletonTable,
} from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { TableColGroup } from "@/components/ui/table";

// Mirrors MyDrive's layout (breadcrumbs + actions row, then the content table) for use as its
// Suspense fallback, so nothing shifts once the real data replaces it.

// The actions row's non-icon elements don't have a "real" width until their text renders, so these
// are best-effort estimates rather than exact matches.
const SEARCH_INPUT_WIDTH = "100%"; // matches ActionsPanel's search InputGroup (w-full)
const SELECT_TOGGLE_WIDTH = "6ch"; // approximates the "Select" toggle's default label width

const TABLE_COLUMN_WIDTHS = [...DATA_COLUMN_WIDTHS, "auto"];
// Mirrors ContentTable's own mobile column hiding (see columns.ts) so the skeleton doesn't
// shift once real data replaces it. Separate arrays because `<col>` and `<th>`/`<td>` need
// different display values to hide the same column (table-column vs. table-cell).
const TABLE_COL_CLASS_NAMES = [
	undefined,
	MOBILE_HIDDEN_COL_CLASS,
	MOBILE_HIDDEN_COL_CLASS,
	MOBILE_HIDDEN_COL_CLASS,
	MOBILE_HIDDEN_COL_CLASS,
	ACTIONS_COL_CLASS,
];
const TABLE_CELL_CLASS_NAMES = [
	undefined,
	MOBILE_HIDDEN_CELL_CLASS,
	MOBILE_HIDDEN_CELL_CLASS,
	MOBILE_HIDDEN_CELL_CLASS,
	MOBILE_HIDDEN_CELL_CLASS,
	ACTIONS_COL_CLASS,
];
const TABLE_ROW_COUNT = 15;

type Props = {
	/** Number of breadcrumb crumbs to render - 1 for the home page, 2 for a folder page. */
	crumbCount?: number;
};

export function MyDriveSkeleton({ crumbCount = 1 }: Props) {
	return (
		<>
			<div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<SkeletonBreadcrumb count={crumbCount} />

				<div className="flex grow shrink-0 flex-wrap items-center gap-1.5">
					<SkeletonInput width={SEARCH_INPUT_WIDTH} />
					<SkeletonIconButton />
					<SkeletonIconButton />
					<Separator
						className="h-8"
						orientation="vertical"
					/>
					<SkeletonButton width={SELECT_TOGGLE_WIDTH} />
				</div>
			</div>

			<Container>
				<SkeletonTable
					columnClassNames={TABLE_CELL_CLASS_NAMES}
					columnCount={TABLE_COLUMN_WIDTHS.length}
					rowCount={TABLE_ROW_COUNT}
				>
					<TableColGroup
						classNames={TABLE_COL_CLASS_NAMES}
						total={COLUMN_RATIO_TOTAL}
						widths={TABLE_COLUMN_WIDTHS}
					/>
				</SkeletonTable>
			</Container>
		</>
	);
}
