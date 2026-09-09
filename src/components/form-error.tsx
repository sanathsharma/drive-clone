import { CircleXIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FieldError } from "@/components/ui/field";

export function FormError({ title, errors }: { title?: string; errors: Array<{ message?: string }> | undefined }) {
	return (
		<Alert variant="destructive">
			<CircleXIcon />
			{title && <AlertTitle>{title}</AlertTitle>}
			<AlertDescription>
				<FieldError errors={errors} />
			</AlertDescription>
		</Alert>
	);
}
