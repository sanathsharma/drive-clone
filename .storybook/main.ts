import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
		"@storybook/addon-mcp",
		"@github-ui/storybook-addon-performance-panel",
	],
	core: {
		disableTelemetry: true,
	},
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
};
export default config;
