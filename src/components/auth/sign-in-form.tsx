"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import * as actions from "@/actions/auth";
import * as PasswordField from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { paths } from "@/constants/paths";
import { Link } from "@/i18n/navigation";
import { toErrorsMap } from "@/lib/errors";
import { handleSubmit } from "@/lib/form";

const TRANSLATIONS_KEY = "sign-in";

export default function SignInForm() {
	const t = useTranslations(TRANSLATIONS_KEY);
	const locale = useLocale();
	const _action = actions.signInWithEmailAndPassword.bind(null, locale);
	const [state, action, isPending] = useActionState(_action, { errors: {} });

	const buttonLabel = isPending ? t("sign-in-pending") : t("sign-in-button");

	const errorsMap = toErrorsMap(state.errors);

	return (
		<main className="main main--dim-full flex justify-center-safe items-center-safe overflow-y-auto">
			<form
				className="max-w-md w-full mx-4 my-8"
				onSubmit={handleSubmit(action)}
			>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>{t("title")}</FieldLegend>
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
						<PasswordField.Root translationsKey={TRANSLATIONS_KEY}>
							<PasswordField.Label />
							<PasswordField.Input
								isInvalid={errorsMap.has("password")}
								name="password"
							/>
							<PasswordField.ErrorMessage errors={errorsMap.get("password")} />
						</PasswordField.Root>
					</FieldSet>
					<Field
						className="justify-end"
						orientation="horizontal"
					>
						<Link
							className="link text-sm"
							href={paths.auth.requestPasswordReset()}
						>
							{t("forgot-password-cta")}
						</Link>
					</Field>
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
					<Field
						className="justify-center"
						orientation="horizontal"
					>
						<p className="text-muted-foreground text-sm">
							{t("already-have-an-account")}{" "}
							<Link
								className="link"
								href={paths.auth.signUp()}
							>
								{t("sign-up-cta")}
							</Link>
						</p>
					</Field>
				</FieldGroup>
			</form>
		</main>
	);
}
