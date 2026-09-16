import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const IGNORE_BUILD_ERRORS = process.env.IGNORE_BUILD_ERRORS === "true";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		globalNotFound: true,
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
