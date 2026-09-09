import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	experimental: {
		globalNotFound: true,
	},
	poweredByHeader: false,
	/* config options here */
	reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
