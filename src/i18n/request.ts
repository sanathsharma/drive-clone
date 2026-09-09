import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
	const _locale = locale || routing.defaultLocale;
	if (!hasLocale(routing.locales, _locale)) {
		notFound();
	}

	return {
		locale: _locale,
		messages: (await import(`../../translations/${_locale}.json`)).default,
	};
});
