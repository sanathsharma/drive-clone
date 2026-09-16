import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const IGNORE_BUILD_ERRORS = process.env.IGNORE_BUILD_ERRORS === "true";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		globalNotFound: true,
	},
	async headers() {
		return [
			{
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
				source: "/(.*)",
			},
			{
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
					{
						key: "Content-Security-Policy",
						value: "default-src 'self'; script-src 'self'",
					},
				],
				source: "/sw.js",
			},
		];
	},
	poweredByHeader: false,
	/* config options here */
	reactCompiler: true,
	typescript: {
		ignoreBuildErrors: IGNORE_BUILD_ERRORS,
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);