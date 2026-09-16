import Link from "next/link";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/constants/paths";
import type { Crumb } from "@/services/content";

export async function RestItems({ crumbs }: { crumbs: Crumb[] }) {
	const renderCrumb = (crumb: (typeof crumbs)[number], index: number) => {
		const isLast = crumbs.length === index + 1;

		if (isLast) {
			return (
				<Fragment key={crumb.id}>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{crumb.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</Fragment>
			);
		}

		return (
			<Fragment key={crumb.id}>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link href={paths.folder(crumb.id)}>{crumb.name}</Link>} />
				</BreadcrumbItem>
			</Fragment>
		);
	};

	return crumbs.map(renderCrumb);
}

export function HomeItem() {
	return (
		<BreadcrumbItem>
			<BreadcrumbLink render={<Link href={paths.root()}>My Drive</Link>} />
		</BreadcrumbItem>
	);
}

export const Separator = BreadcrumbSeparator;

export function DropdownItem({ crumbs }: { crumbs: Crumb[] }) {
	const renderCrumb = (crumb: Crumb) => {
		return (
			<DropdownMenuItem
				key={crumb.id}
				render={<Link href={paths.folder(crumb.id)}>{crumb.name}</Link>}
			/>
		);
	};

	return (
		<BreadcrumbItem>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon-sm"
							variant="ghost"
						>
							<BreadcrumbEllipsis />
							<span className="sr-only">Toggle menu</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="start">
					<DropdownMenuGroup>{crumbs.map(renderCrumb)}</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</BreadcrumbItem>
	);
}

export function Root({ children }: { children: React.ReactNode }) {
	return (
		<Breadcrumb>
			<BreadcrumbList>{children}</BreadcrumbList>
		</Breadcrumb>
	);
}
