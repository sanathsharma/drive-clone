import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
	/** Required so the placeholder occupies the same width as the input it stands in for. */
	width: React.CSSProperties["width"];
};

export function SkeletonInput({ className, width }: Props) {
	return (
		<Skeleton
			className={cn("h-8 rounded-lg", className)}
			style={{ width }}
		/>
	);
}
