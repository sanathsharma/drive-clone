import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
	count: number;
};

export function SkeletonBreadcrumb({ count }: Props) {
	const crumbs = Array.from({ length: count });

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{crumbs.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed-length run of placeholder crumbs, never reordered
					<Fragment key={index}>
						{index > 0 && <BreadcrumbSeparator />}
						<BreadcrumbItem>
							<Skeleton className="h-4 w-16" />
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
