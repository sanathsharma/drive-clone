"use server";

import { type } from "arktype";
import { getTranslations } from "next-intl/server";
import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";
import { toFieldErrors } from "@/lib/errors";
import passwordSchema from "./utils/password-schema";

const schema = type({
	email: "string.email",
	password: passwordSchema,
});

type FormState = {
	errors: {
		email?: { message: string }[];
		password?: { message: string }[];
		_form?: { message: string }[];
	};
};

export async function signInWithEmailAndPassword(locale: string, _: FormState, formData: FormData): Promise<FormState> {
	const data = Object.fromEntries(formData);
	const t = await getTranslations("sign-in");

	const result = schema(data);

	if (result instanceof type.errors) {
		return {
			errors: toFieldErrors(result, t),
		};
	}

	const { error } = await auth.signIn.email({
		email: result.email,
		password: result.password,
	});

	if (error) {
		const message = error.message || t("failed-to-sign-in");
		return {
			errors: {
				_form: [{ message }],
			},
		};
	}

	redirect({
		href: paths.dashboard(),
		locale,
	});
}
