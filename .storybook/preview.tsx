import addonPerformancePanel from "@github-ui/storybook-addon-performance-panel";
import { definePreview } from "@storybook/nextjs-vite";
import "../src/app/[locale]/globals.css";

const preview = definePreview({
	addons: [addonPerformancePanel()],
	decorators: [
		(Story, context) => {
			document.documentElement.classList.add("font-sans", "antialiased");
			document.documentElement.classList.toggle("dark", context.globals.theme === "dark");
			return <Story />;
		},
	],
	globalTypes: {
		theme: {
			description: "Theme (light/dark)",
			toolbar: {
				dynamicTitle: true,
				icon: "mirror",
				items: [
					{ icon: "sun", title: "Light", value: "light" },
					{ icon: "moon", title: "Dark", value: "dark" },
				],
			},
		},
	},
	initialGlobals: {
		theme: "dark",
	},
	parameters: {
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
});

export default preview;
