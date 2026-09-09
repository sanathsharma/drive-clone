"use server";

import { type } from "arktype";
import { getTranslations } from "next-intl/server";
import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";
import { toFieldErrors } from "@/lib/errors";

const schema = type({
	email: "string.email",
});

type FormState = {
	errors: {
		email?: { message: string }[];
		_form?: { message: string }[];
	};
};

export async function requestPasswordReset(locale: string, _: FormState, formData: FormData): Promise<FormState> {
	const data = Object.fromEntries(formData);
	const t = await getTranslations("request-password-reset");

	const result = schema(data);

	if (result instanceof type.errors) {
		return {
			errors: toFieldErrors(result, t),
		};
	}
	const { error } = await auth.requestPasswordReset({
		email: result.email,
		redirectTo: paths.auth.resetPassword(),
	});

	if (error) {
		const message = error.message || t("failed-to-submit-form");
		return {
			errors: {
				_form: [{ message }],
			},
		};
	}

	const [localPart, domain] = result.email.split("@");
	const maskedEmail = `${localPart.slice(0, 3)}***@${domain}`;

	redirect({
		href: paths.auth.requestPasswordReset({ code: "EMAIL_SENT", email: maskedEmail }),
		locale,
	});
}
