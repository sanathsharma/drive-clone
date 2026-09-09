"use server";

import { type } from "arktype";
import { getTranslations } from "next-intl/server";
import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";
import { toFieldErrors } from "@/lib/errors";
import passwordSchema from "./utils/password-schema";

const schema = type({
	newPassword: passwordSchema,
	token: "string",
});

type FormState = {
	errors: {
		newPassword?: { message: string }[];
		token?: { message: string }[];
		_form?: { message: string }[];
	};
};

type Translator = Awaited<ReturnType<typeof getTranslations>>;

export async function resetPassword(locale: string, _: FormState, formData: FormData): Promise<FormState> {
	const data = Object.fromEntries(formData);
	const t = await getTranslations("reset-password");

	const result = schema(data);

	if (result instanceof type.errors) {
		return {
			errors: toFieldErrors(result, t),
		};
	}

	const { error } = await auth.resetPassword({
		newPassword: result.newPassword,
		token: result.token,
	});

	if (error) {
		return {
			errors: {
				_form: [{ message: toMessage(error, t) }],
			},
		};
	}

	redirect({
		href: paths.auth.signIn(t("success-message")),
		locale,
	});
}

type Error = {
	code?: string | undefined | undefined;
	message?: string | undefined | undefined;
	status: number;
	statusText: string;
};

function toMessage(error: Error, t: Translator) {
	if (!error.code) {
		return t("failed-to-reset-password");
	}

	const map: Record<string, string> = {
		bad_jwt: t("bad-jwt"),
	};

	if (map[error.code]) {
		return map[error.code];
	}

	return t("failed-to-reset-password");
}
