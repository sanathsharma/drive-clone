import logger from "@/lib/logger";
import { getBreadcrumbsFor } from "@/services/content";
import * as Crumbs from "./components";

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

	return (
		<Crumbs.Root>
			<Crumbs.HomeItem />
			<Crumbs.RestItems crumbs={crumbs} />
		</Crumbs.Root>
	);
}
