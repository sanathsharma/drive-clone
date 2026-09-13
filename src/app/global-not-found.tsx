import { ArrowUpIcon, Link2OffIcon } from "lucide-react";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { paths } from "@/constants/paths";
import { cn } from "@/lib/utils";
import "./[locale]/globals.css";

export const metadata: Metadata = {
	description: "The page you are looking for does not exist.",
	title: "404 - Page Not Found",
};

export default async function GlobalNotFound() {
	return (
		<html
			className="font-sans h-full antialiased dark"
			lang="en"
		>
			<body className="min-h-full flex flex-col bg-crust text-foreground">
				<main className="main main--dim-full flex justify-center-safe items-center-safe overflow-y-auto">
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Link2OffIcon />
							</EmptyMedia>
							<EmptyTitle>404 - Page Not Found</EmptyTitle>
							<EmptyDescription>
								The page you&apos;re looking for doesn&apos;t exist
								<br /> or has been moved.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<a
								className={cn(buttonVariants({ size: "sm", variant: "link" }))}
								href={paths.root()}
							>
								Take me home{" "}
								<ArrowUpIcon
									className="inline w-[1em]"
									transform="rotate(45)"
								/>
							</a>
						</EmptyContent>
					</Empty>
				</main>
			</body>
		</html>
	);
}
