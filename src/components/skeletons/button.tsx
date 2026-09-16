import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Mirrors the height scale in components/ui/button.tsx's `size` variants (icon sizes excluded -
// see SkeletonIconButton).
const HEIGHT_BY_SIZE = {
	default: "h-8",
	lg: "h-9",
	sm: "h-7",
	xs: "h-6",
} as const;

type Props = {
	className?: string;
	size?: keyof typeof HEIGHT_BY_SIZE;
	/** Required so the placeholder occupies the same width as the button it stands in for. */
	width: React.CSSProperties["width"];
};

export function SkeletonButton({ className, size = "default", width }: Props) {
	return (
		<Skeleton
			className={cn("rounded-lg", HEIGHT_BY_SIZE[size], className)}
			style={{ width }}
		/>
	);
}
