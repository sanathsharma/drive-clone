import { ArrowLeftIcon, ClockFadingIcon, FolderIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Item, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { paths } from "@/constants/paths";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

type Props = {
	email: string;
};

export default async function EmailSent({ email }: Props) {
	const t = await getTranslations("email-sent");
	const items = [
		{ description: t("item-check-spam"), icon: FolderIcon },
		{ description: t("item-old-links"), icon: ClockFadingIcon },
	];

	return (
		<main className="main main--dim-full flex justify-center-safe items-center-safe overflow-y-auto">
			<div className="flex flex-col px-4 py-8 gap-5 h-full sm:h-auto">
				<Link
					className="link text-sm flex items-center"
					href={paths.auth.signIn()}
					replace
				>
					<ArrowLeftIcon className="size-4 mr-1" />
					{t("back-to-sign-in")}
				</Link>
				<Empty className="text-start max-w-md w-full p-0">
					<EmptyHeader className="items-start max-w-md">
						<EmptyMedia variant="icon">
							<MailIcon />
						</EmptyMedia>
						<EmptyTitle>{t("title")}</EmptyTitle>
						<EmptyDescription>{t("description")}</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="items-start max-w-md">
						<p className="font-mono text-lg">{email}</p>

						<Separator className="my-4" />

						<section className="text-sm text-muted-foreground">
							<header className="font-medium mb-2">{t("not-received-email")}</header>
							<ul className="list-disc list-inside">
								{items.map(({ description, icon: Icon }) => (
									<Item
										className="px-0 py-1"
										key={description}
										size="xs"
									>
										<ItemMedia variant="icon">
											<Icon />
										</ItemMedia>
										<ItemContent>
											<ItemDescription>{description}</ItemDescription>
										</ItemContent>
									</Item>
								))}
							</ul>
						</section>
					</EmptyContent>
				</Empty>
				<Link
					className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
					href={paths.auth.requestPasswordReset()}
					replace
				>
					{t("use-different-email")}
				</Link>
			</div>
		</main>
	);
}
