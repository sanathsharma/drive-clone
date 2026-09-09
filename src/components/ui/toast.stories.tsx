import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Toaster, toast } from "./toast";

const meta = {
	component: Toaster,
	tags: ["ai-generated"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		toast.add({
			description: "Your changes have been saved.",
			title: "Saved",
			type: "success",
		});

		const body = within(canvasElement.ownerDocument.body);
		await expect(await body.findByText("Saved")).toBeVisible();
	},
};

export const ErrorToast: Story = {
	play: async ({ canvasElement }) => {
		toast.add({
			description: "The server couldn't process your request.",
			title: "Something went wrong",
			type: "error",
		});

		const body = within(canvasElement.ownerDocument.body);
		await expect(await body.findByText("Something went wrong")).toBeVisible();
	},
};
