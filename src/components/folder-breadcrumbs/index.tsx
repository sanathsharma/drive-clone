import logger from "@/lib/logger";
import { getBreadcrumbsFor } from "@/services/content";
import { BreadcrumbsClient } from "./breadcrumbs-client";
import * as Crumbs from "./components";

type Props = {
	folderId?: string;
};

export default function FolderBreadcrumbs({ folderId }: Props) {
	if (!folderId) {
		return (
			<Crumbs.Root>
				<Crumbs.HomeItem />
			</Crumbs.Root>
		);
	}

	const crumbsPromise = getBreadcrumbsFor(folderId);
	crumbsPromise.then(({ error }) => {
		if (error) {
			logger.error(error);
		}
	});

	return <BreadcrumbsClient crumbsPromise={crumbsPromise} />;
}
