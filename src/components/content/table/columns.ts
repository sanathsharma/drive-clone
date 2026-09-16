import type { TableColWidth } from "@/components/ui/table";

// name : type : size : created : updated - keep in sync with the columns rendered in
// ContentTableHeader/ContentTableRow. The checkbox and actions columns are "auto" - they defer to
// their own w-8 <th>/<td> classes instead of taking a share of this ratio.
// Kept in a plain (non "use client") module so MyDriveSkeleton, a server component, can import
// these values directly instead of through a client-component boundary.
export const COLUMN_RATIO_TOTAL = 10;
export const DATA_COLUMN_WIDTHS: TableColWidth[] = ["auto", 1, 1, 2, 2];
