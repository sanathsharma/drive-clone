import logger from "@/lib/logger";
import { getBreadcrumbsFor } from "@/services/content";
import * as Crumbs from "./components";

const MAX_VISIBLE_CRUMBS = 3;
const TRAILING_VISIBLE_CRUMBS = 2;

type Props = {
	folderId?: string;
};

export default async function FolderBreadcrumbs({ folderId }: Props) {
	if (!folderId) {
		return (
			<Crumbs.Root>
				<Crumbs.HomeItem />
			</Crumbs.Root>
		);
	}

	const { data: crumbs, error } = await getBreadcrumbsFor(folderId);
	if (error) {
		logger.error(error);
		return null;
	}

	if (crumbs.length > MAX_VISIBLE_CRUMBS) {
		const overflowCrumbs = crumbs.slice(0, -TRAILING_VISIBLE_CRUMBS);
		const visibleCrumbs = crumbs.slice(-TRAILING_VISIBLE_CRUMBS);

		return (
			<Crumbs.Root>
				<Crumbs.HomeItem />
				<Crumbs.Separator />
				<Crumbs.DropdownItem crumbs={overflowCrumbs} />
				<Crumbs.RestItems crumbs={visibleCrumbs} />
			</Crumbs.Root>
		);
	}

	return (
		<Crumbs.Root>
			<Crumbs.HomeItem />
			<Crumbs.RestItems crumbs={crumbs} />
		</Crumbs.Root>
	);
}
