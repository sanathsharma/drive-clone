"use server";

import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/server";

export async function signOut(locale: string) {
	await auth.signOut();

	redirect({
		href: paths.auth.signIn(),
		locale,
	});
}
