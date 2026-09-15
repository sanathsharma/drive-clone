"use client";

import { UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDragCount } from "@/components/content/drag-count-context";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type RootProps = React.ComponentProps<"div"> & {
	children?: React.ReactNode;
};

export function Root({ children, className, ...rest }: RootProps) {
	return (
		<div
			className={cn(
				"w-full h-full flex flex-col items-center justify-center text-sm text-muted-foreground",
				"border-dashed border rounded border-primary",
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
}

type Props = {
	folderName: string;
};

export function Content({ folderName }: Props) {
	const filesCount = useDragCount();
	const t = useTranslations("upload-files");

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<UploadIcon />
				</EmptyMedia>
				<EmptyTitle>
					{t("drag-active-title")} <br />
					<b>{folderName}</b>
				</EmptyTitle>
				{!!filesCount && <EmptyDescription>({t("files-count-label", { count: filesCount })})</EmptyDescription>}
			</EmptyHeader>
		</Empty>
	);
}
