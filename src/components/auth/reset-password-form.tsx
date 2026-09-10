"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import * as actions from "@/actions/auth";
import * as PasswordField from "@/components/auth/password-field";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { paths } from "@/constants/paths";
import { Link } from "@/i18n/navigation";
import { handleSubmit, useActionWithReset } from "@/lib/form";
import { toErrorsMap } from "@/lib/form-errors";

const TRANSLATIONS_KEY = "reset-password";

type Props = {
	token: string;
};

export default function ResetPasswordForm({ token }: Props) {
	const t = useTranslations(TRANSLATIONS_KEY);
	const locale = useLocale();
	const [formRef, _action] = useActionWithReset(actions.resetPassword.bind(null, locale));
	const [state, action, isPending] = useActionState(_action, { errors: {} });

	const buttonLabel = isPending ? t("reset-pending") : t("reset-button");

	const errorsMap = toErrorsMap(state.errors);

	return (
		<main className="main main--dim-full flex justify-center-safe items-center-safe overflow-y-auto">
			<form
				className="max-w-md w-full mx-4 my-8"
				onSubmit={handleSubmit(action)}
				ref={formRef}
			>
				<input
					name="token"
					type="hidden"
					value={token}
				/>
				<FieldGroup>
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
						<PasswordField.Root translationsKey={TRANSLATIONS_KEY}>
							<PasswordField.Label />
							<PasswordField.Input
								autoFocus
								isInvalid={errorsMap.has("newPassword")}
								name="newPassword"
							/>
							<PasswordField.ErrorMessage errors={errorsMap.get("newPassword")} />
							<PasswordField.Description />
						</PasswordField.Root>
					</FieldSet>
					<Field orientation="horizontal">
						<Button
							className="w-full"
							disabled={isPending}
							type="submit"
						>
							{buttonLabel}
						</Button>
					</Field>

					<Field orientation="horizontal">
						{errorsMap.has("_form") && (
							<FormError
								errors={errorsMap.get("_form")}
								title={t("failed-to-reset-password")}
							/>
						)}
					</Field>
				</FieldGroup>
			</form>
		</main>
	);
}
