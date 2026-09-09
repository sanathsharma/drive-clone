"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import * as actions from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { paths } from "@/constants/paths";
import { Link } from "@/i18n/navigation";
import { toErrorsMap } from "@/lib/errors";
import { handleSubmit } from "@/lib/form";

const TRANSLATIONS_KEY = "request-password-reset";

export default function RequestPasswordResetForm() {
	const t = useTranslations(TRANSLATIONS_KEY);
	const locale = useLocale();
	const _action = actions.requestPasswordReset.bind(null, locale);
	const [state, action, isPending] = useActionState(_action, { errors: {} });

	const buttonLabel = isPending ? t("pending-button") : t("submit-button");

	const errorsMap = toErrorsMap(state.errors);

	return (
		<main className="main main--dim-full flex justify-center-safe items-center-safe overflow-y-auto">
			<form
				className="max-w-md w-full mx-4 my-8 h-[calc(100%-4rem)] sm:h-auto"
				onSubmit={handleSubmit(action)}
			>
				<FieldGroup className="justify-between h-full sm:h-auto">
					<Field orientation="horizontal">
						<Link
							className="link text-sm flex items-center"
							href={paths.auth.signIn()}
						>
							<ArrowLeftIcon className="size-4 mr-1" />
							{t("back-to-sign-in")}
						</Link>
					</Field>
					<FieldSet>
						<FieldLegend>{t("title")}</FieldLegend>
						<FieldDescription>{t("description")}</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">
									{t("email-label")}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									aria-invalid={errorsMap.has("email")}
									autoFocus
									id="email"
									name="email"
									placeholder={t("email-placeholder")}
								/>
								{errorsMap.has("email") && <FieldError errors={errorsMap.get("email")} />}
							</Field>
						</FieldGroup>
					</FieldSet>
					{/* TODO: show alert for errors._form */}
					<Field orientation="horizontal">
						<Button
							className="w-full"
							disabled={isPending}
							type="submit"
						>
							{buttonLabel}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</main>
	);
}
