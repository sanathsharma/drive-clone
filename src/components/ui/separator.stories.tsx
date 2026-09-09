import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Separator } from "./separator";

const meta = {
	component: Separator,
	tags: ["ai-generated"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	play: async ({ canvasElement }) => {
		const separator = canvasElement.querySelector('[data-slot="separator"]');
		await expect(separator).toHaveAttribute("data-orientation", "horizontal");
	},
	render: (args) => (
		<div className="w-64">
			<p>Above</p>
			<Separator
				{...args}
				className="my-3"
			/>
			<p>Below</p>
		</div>
	),
};

export const Vertical: Story = {
	args: { orientation: "vertical" },
	render: (args) => (
		<div className="flex h-8 items-center gap-3">
			<span>Left</span>
			<Separator {...args} />
			<span>Right</span>
		</div>
	),
};
