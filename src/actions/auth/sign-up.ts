"use server";

import { type } from "arktype";
import { getTranslations } from "next-intl/server";
import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";
import { toFieldErrors } from "@/lib/form-errors";
import passwordSchema from "./utils/password-schema";

const schema = type({
	email: "string.email",
	name: "string.trim |> /^[a-zA-Z]+( [a-zA-Z]+)*$/ |> 3 <= string <= 100",
	password: passwordSchema,
});

type FormState = {
	errors: {
		email?: { message: string }[];
		name?: { message: string }[];
		password?: { message: string }[];
		_form?: { message: string }[];
	};
};

export async function signUpWithEmailAndPassword(locale: string, _: FormState, formData: FormData): Promise<FormState> {
	const data = Object.fromEntries(formData);
	const t = await getTranslations("sign-up");

	const result = schema(data);

	if (result instanceof type.errors) {
		return {
			errors: toFieldErrors(result, t),
		};
	}

	const { error } = await auth.signUp.email({
		email: result.email,
		name: result.name,
		password: result.password,
	});

	if (error) {
		const message = error.message || t("failed-to-sign-up");
		return {
			errors: {
				_form: [{ message }],
			},
		};
	}

	// successful sign-up also logs the user in, so redirect to the dashboard
	redirect({
		href: paths.dashboard(),
		locale,
	});
}
