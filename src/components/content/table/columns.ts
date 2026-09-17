import type { TableColWidth } from "@/components/ui/table";

// name : type : size : created : updated - keep in sync with the columns rendered in
// ContentTableHeader/ContentTableRow. The checkbox and actions columns are "auto" - they defer to
// their own w-8 <th>/<td> classes instead of taking a share of this ratio.
// Kept in a plain (non "use client") module so MyDriveSkeleton, a server component, can import
// these values directly instead of through a client-component boundary.
export const COLUMN_RATIO_TOTAL = 10;
export const DATA_COLUMN_WIDTHS: TableColWidth[] = ["auto", 1, 1, 2, 2];

// Below `sm`, only Name and Actions stay in the table; Type/Size/Created/Updated move into the
// row's info dialog instead. `table-cell`/`table-column` (rather than `flex`/`block`) keep the
// <td>/<th>/<col> in the table's display algorithm once visible again at `sm`.
export const MOBILE_HIDDEN_CELL_CLASS = "hidden md:table-cell";
export const MOBILE_HIDDEN_COL_CLASS = "hidden md:table-column";
// The actions cell holds one icon on `md`+ (kebab only) but two below it (info + kebab), so its
// column needs to widen on mobile instead of using a single fixed width.
export const ACTIONS_COL_CLASS = "w-20 md:w-12";