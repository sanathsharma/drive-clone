"use client";

import { use } from "react";
import type { Result } from "@/lib/api-errors";
import { useMediaQuery } from "@/lib/use-media-query";
import type { Crumb } from "@/services/content";
import * as Crumbs from "./components";

const SM_MAX_VISIBLE_CRUMBS = 2;
const DESKTOP_MAX_VISIBLE_CRUMBS = 3;
const TRAILING_VISIBLE_CRUMBS = 2;

const SM_MEDIA_QUERY = "(max-width: 639.98px)";

type Props = {
	crumbsPromise: Promise<Result<Crumb[]>>;
};

export function BreadcrumbsClient({ crumbsPromise }: Props) {
	const { data: crumbs, error } = use(crumbsPromise);
	const isSmScreen = useMediaQuery(SM_MEDIA_QUERY);

	if (error || !crumbs) {
		return (
			<Crumbs.Root>
				<Crumbs.HomeItem />
			</Crumbs.Root>
		);
	}

	const maxVisible = isSmScreen ? SM_MAX_VISIBLE_CRUMBS : DESKTOP_MAX_VISIBLE_CRUMBS;

	if (crumbs.length <= maxVisible) {
		return (
			<Crumbs.Root>
				<Crumbs.HomeItem />
				<Crumbs.RestItems crumbs={crumbs} />
			</Crumbs.Root>
		);
	}

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
