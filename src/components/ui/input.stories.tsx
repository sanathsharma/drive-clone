import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Input } from "./input";

const meta = {
	component: Input,
	tags: ["ai-generated"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { placeholder: "you@example.com", type: "email" },
};

export const WithValue: Story = {
	args: { defaultValue: "jane.doe@acme.com", type: "email" },
};

export const Disabled: Story = {
	args: { disabled: true, placeholder: "Can't touch this" },
	play: async ({ canvas }) => {
		await expect(canvas.getByPlaceholderText("Can't touch this")).toBeDisabled();
	},
};

export const Invalid: Story = {
	args: { "aria-invalid": true, defaultValue: "not-an-email", type: "email" },
	play: async ({ canvas }) => {
		await expect(canvas.getByDisplayValue("not-an-email")).toHaveAttribute("aria-invalid", "true");
	},
};
