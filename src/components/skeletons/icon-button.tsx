import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Mirrors components/ui/button.tsx's icon `size` variants - square, so no width prop is needed.
const SIZE_CLASSES = {
	icon: "size-8",
	"icon-lg": "size-9",
	"icon-sm": "size-7",
	"icon-xs": "size-6",
} as const;

type Props = {
	className?: string;
	size?: keyof typeof SIZE_CLASSES;
};

export function SkeletonIconButton({ className, size = "icon" }: Props) {
	return <Skeleton className={cn("rounded-lg", SIZE_CLASSES[size], className)} />;
}
