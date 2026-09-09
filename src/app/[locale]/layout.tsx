import type { Metadata } from "next";
import "./globals.css";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
	description: "ERP System",
	title: "ERP System",
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
	const locale = await rootParams.locale();
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html
			className="font-sans h-full antialiased dark"
			lang={locale}
		>
			<body className="min-h-full flex flex-col bg-crust text-foreground">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
