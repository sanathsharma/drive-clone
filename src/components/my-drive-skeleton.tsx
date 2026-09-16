import { Container } from "@/components/content/container";
import { COLUMN_RATIO_TOTAL, DATA_COLUMN_WIDTHS } from "@/components/content/table/columns";
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
const SEARCH_INPUT_WIDTH = "12rem"; // matches ActionsPanel's search InputGroup (w-48)
const SELECT_TOGGLE_WIDTH = "6ch"; // approximates the "Select" toggle's default label width

const TABLE_COLUMN_WIDTHS = [...DATA_COLUMN_WIDTHS, "3rem"];
const TABLE_ROW_COUNT = 15;

type Props = {
	/** Number of breadcrumb crumbs to render - 1 for the home page, 2 for a folder page. */
	crumbCount?: number;
};

export function MyDriveSkeleton({ crumbCount = 1 }: Props) {
	return (
		<>
			<div className="flex items-center justify-between gap-2">
				<SkeletonBreadcrumb count={crumbCount} />

				<div className="flex shrink-0 items-center gap-1.5">
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
					columnCount={TABLE_COLUMN_WIDTHS.length}
					rowCount={TABLE_ROW_COUNT}
				>
					<TableColGroup
						total={COLUMN_RATIO_TOTAL}
						widths={TABLE_COLUMN_WIDTHS}
					/>
				</SkeletonTable>
			</Container>
		</>
	);
}
