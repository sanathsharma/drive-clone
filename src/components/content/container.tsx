import type { ComponentProps } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div"> & {
	children?: React.ReactNode;
};

export function Container({ children, className, ...rest }: Props) {
	return (
		<ScrollArea
			className={cn("w-full grow", className)}
			{...rest}
		>
			{children}
		</ScrollArea>
	);
}