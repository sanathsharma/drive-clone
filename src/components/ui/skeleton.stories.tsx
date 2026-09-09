import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta = {
	component: Skeleton,
	tags: ["ai-generated"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { className: "h-4 w-48" },
};

export const Avatar: Story = {
	args: { className: "size-12 rounded-full" },
};

export const CardPlaceholder: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Skeleton className="h-32 w-64 rounded-lg" />
			<div className="flex flex-col gap-2">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-32" />
			</div>
		</div>
	),
};
