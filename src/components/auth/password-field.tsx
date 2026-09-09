"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

type PasswordFieldContextValue = {
	t: ReturnType<typeof useTranslations>;
};

const PasswordFieldContext = createContext<PasswordFieldContextValue | null>(null);

function usePasswordFieldContext() {
	const context = useContext(PasswordFieldContext);

	if (!context) {
		throw new Error("PasswordField compound components must be used within PasswordField.Root");
	}

	return context;
}

type RootProps = PropsWithChildren<{
	translationsKey?: string;
}>;

export function Root({ translationsKey, children }: RootProps) {
	const t = useTranslations(translationsKey);

	return (
		<PasswordFieldContext.Provider value={{ t }}>
			<FieldGroup>
				<Field>{children}</Field>
			</FieldGroup>
		</PasswordFieldContext.Provider>
	);
}

export function Label() {
	const { t } = usePasswordFieldContext();

	return (
		<FieldLabel htmlFor="password">
			{t("password-label")}
			<span className="text-destructive">*</span>
		</FieldLabel>
	);
}

type InputProps = ComponentProps<"input"> & {
	name: string;
	isInvalid?: boolean;
};

export function Input({ name, isInvalid, ...restProps }: InputProps) {
	const { t } = usePasswordFieldContext();
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const icon = showPassword ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />;
	const type = showPassword ? "text" : "password";
	const label = showPassword ? t("show-password-label") : t("hide-password-label");

	return (
		<InputGroup>
			<InputGroupInput
				aria-invalid={isInvalid}
				id="password"
				name={name}
				placeholder={t("password-placeholder")}
				type={type}
				{...restProps}
			/>
			<InputGroupAddon align="inline-end">
				<button
					aria-label={label}
					className="touch-friendly-icon-btn"
					onClick={togglePasswordVisibility}
					type="button"
				>
					{icon}
				</button>
			</InputGroupAddon>
		</InputGroup>
	);
}

type ErrorMessageProps = {
	errors?: { message: string }[];
};

export function ErrorMessage({ errors }: ErrorMessageProps) {
	return <FieldError errors={errors} />;
}

export function Description() {
	const { t } = usePasswordFieldContext();

	return <FieldDescription>{t("password-description")}</FieldDescription>;
}
