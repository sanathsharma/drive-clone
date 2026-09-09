import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "./field";
import { Input } from "./input";

const meta = {
	component: Field,
	tags: ["ai-generated"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Field>
			<FieldLabel htmlFor="story-field-email">Email</FieldLabel>
			<Input
				id="story-field-email"
				placeholder="you@example.com"
				type="email"
			/>
			<FieldDescription>We&lsquo;ll only use this to send you a receipt.</FieldDescription>
		</Field>
	),
};

export const Horizontal: Story = {
	render: () => (
		<Field orientation="horizontal">
			<FieldLabel htmlFor="story-field-notify">Notifications</FieldLabel>
			<FieldContent>
				<FieldDescription>Get emailed when a new invoice is ready.</FieldDescription>
			</FieldContent>
		</Field>
	),
};

export const WithError: Story = {
	play: async ({ canvas }) => {
		await expect(canvas.getByRole("alert")).toHaveTextContent("Password must be at least 8 characters.");
	},
	render: () => (
		<Field data-invalid="true">
			<FieldLabel htmlFor="story-field-password">Password</FieldLabel>
			<Input
				aria-invalid
				id="story-field-password"
				type="password"
			/>
			<FieldError errors={[{ message: "Password must be at least 8 characters." }]} />
		</Field>
	),
};

export const FormLayout: Story = {
	render: () => (
		<FieldSet className="w-80">
			<FieldLegend>Sign in</FieldLegend>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="story-form-email">Email</FieldLabel>
					<Input
						id="story-form-email"
						type="email"
					/>
				</Field>
				<FieldSeparator>or</FieldSeparator>
				<Field>
					<FieldLabel htmlFor="story-form-password">Password</FieldLabel>
					<Input
						id="story-form-password"
						type="password"
					/>
				</Field>
			</FieldGroup>
		</FieldSet>
	),
};
