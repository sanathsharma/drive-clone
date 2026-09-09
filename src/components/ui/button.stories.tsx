import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Button } from "./button";

const meta = {
	component: Button,
	tags: ["ai-generated"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: "Save changes" },
};

export const Destructive: Story = {
	args: { children: "Delete account", variant: "destructive" },
};

export const Outline: Story = {
	args: { children: "Cancel", variant: "outline" },
};

export const Secondary: Story = {
	args: { children: "Learn more", variant: "secondary" },
};

export const Ghost: Story = {
	args: { children: "Dismiss", variant: "ghost" },
};

export const Link: Story = {
	args: { children: "View details", variant: "link" },
};

export const Disabled: Story = {
	args: { children: "Processing", disabled: true },
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("button", { name: /processing/i })).toBeDisabled();
	},
};

// Button's default variant uses bg-primary. In src/app/globals.css, .dark's
// --primary is hsl(217deg 91.87% 75.88%), the Catppuccin Mocha "blue" —
// rgb(137, 180, 250). If that token changes, update the value below to match.
// Pinned to the dark theme regardless of the toolbar toggle, since the
// asserted color is specific to .dark.
export const CssCheck: Story = {
	args: { children: "Submit" },
	globals: { theme: "dark" },
	play: async ({ canvas }) => {
		const button = canvas.getByRole("button", { name: /submit/i });
		await expect(getComputedStyle(button).backgroundColor).toBe("rgb(137, 180, 250)");
	},
};
