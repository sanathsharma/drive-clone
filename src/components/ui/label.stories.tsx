import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
	component: Label,
	tags: ["ai-generated"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: "Email address" },
};

export const PairedWithInput: Story = {
	render: () => (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor="story-email">Email address</Label>
			<Input
				id="story-email"
				placeholder="you@example.com"
				type="email"
			/>
		</div>
	),
};

export const DisabledGroup: Story = {
	render: () => (
		<div
			className="group flex flex-col gap-1.5"
			data-disabled="true"
		>
			<Label htmlFor="story-disabled">Team name</Label>
			<Input
				disabled
				id="story-disabled"
				placeholder="Acme Inc."
			/>
		</div>
	),
};
