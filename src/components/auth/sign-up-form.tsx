"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import * as actions from "@/actions/auth";
import * as PasswordField from "@/components/auth/password-field";
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
import { toErrorsMap } from "@/lib/errors";
import { handleSubmit } from "@/lib/form";

const TRANSLATIONS_KEY = "sign-up";

export default function SignUpForm() {
	const t = useTranslations(TRANSLATIONS_KEY);
	const locale = useLocale();
	const _action = actions.signUpWithEmailAndPassword.bind(null, locale);
	const [state, action, isPending] = useActionState(_action, { errors: {} });

	const buttonLabel = isPending ? t("sign-up-pending") : t("sign-up-button");

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
						<FieldDescription>{t("description")}</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">
									{t("name-label")}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									aria-invalid={errorsMap.has("name")}
									autoFocus
									id="name"
									name="name"
									placeholder={t("name-placeholder")}
								/>
								{errorsMap.has("name") && <FieldError errors={errorsMap.get("name")} />}
							</Field>
						</FieldGroup>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">
									{t("email-label")}
									<span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									aria-invalid={errorsMap.has("email")}
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
							<PasswordField.Description />
						</PasswordField.Root>
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
					<Field
						className="justify-center"
						orientation="horizontal"
					>
						<p className="text-muted-foreground text-sm">
							{t("sign-in-cta-description")}{" "}
							<Link
								className="link"
								href={paths.auth.signIn()}
							>
								{t("sign-in-cta")}
							</Link>
						</p>
					</Field>
				</FieldGroup>
			</form>
		</main>
	);
}
