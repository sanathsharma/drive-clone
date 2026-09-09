import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			autoComplete="off"
			className={cn(
				"h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1",
				"text-base outline-none transition-colors md:text-sm",
				"file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
				"placeholder:text-muted-foreground",
				"focus-visible:c_outline-inset",
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
				"aria-invalid:c_outline-destructive-inset",
				"dark:bg-input/30 dark:disabled:bg-input/80",
				className,
			)}
			data-slot="input"
			type={type}
			{...props}
		/>
	);
}

export { Input };
