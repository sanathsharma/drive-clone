"use client";

import { FolderPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useId, useState } from "react";
import * as actions from "@/actions/folders";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleSubmit, useActionWithReset } from "@/lib/form";
import { toErrorsMap } from "@/lib/form-errors";

type Props = {
	parentId?: string;
	trigger?: "icon" | "text";
};

const initialState = { errors: {}, success: false };

export function CreateFolderDialog({ parentId, trigger = "icon" }: Props) {
	const t = useTranslations("content.create-folder-dialog");
	const [open, setOpen] = useState(false);
	const [formRef, boundAction] = useActionWithReset(actions.createFolder.bind(null, parentId));
	const [state, action, isPending] = useActionState(boundAction, initialState);
	const nameId = useId();

	// Closes the dialog once the action resolves successfully. Adjusting state during
	// render (rather than in an effect) avoids an extra commit - see
	// https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
	const [handledState, setHandledState] = useState(state);
	if (state !== handledState) {
		setHandledState(state);
		if (state.success) {
			setOpen(false);
		}
	}

	const errorsMap = toErrorsMap(state.errors);

	return (
		<Dialog
			onOpenChange={setOpen}
			open={open}
		>
			<DialogTrigger
				render={
					trigger === "icon" ? (
						<Button
							aria-label={t("trigger-label")}
							size="icon-sm"
							variant="outline"
						>
							<FolderPlusIcon />
						</Button>
					) : (
						<Button variant="outline">{t("trigger-label")}</Button>
					)
				}
			/>
			<DialogContent>
				<form
					onSubmit={handleSubmit(action)}
					ref={formRef}
				>
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<Field>
							<FieldLabel htmlFor={nameId}>{t("name-label")}</FieldLabel>
							<Input
								aria-invalid={errorsMap.has("name")}
								autoFocus
								id={nameId}
								name="name"
								placeholder={t("name-placeholder")}
							/>
							<FieldError errors={errorsMap.get("name")} />
						</Field>
						{errorsMap.has("_form") && <FieldError errors={errorsMap.get("_form")} />}
					</FieldGroup>

					<DialogFooter>
						<DialogClose
							render={
								<Button
									type="button"
									variant="outline"
								>
									{t("cancel")}
								</Button>
							}
						/>
						<Button
							disabled={isPending}
							type="submit"
						>
							{isPending ? t("pending") : t("submit")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
