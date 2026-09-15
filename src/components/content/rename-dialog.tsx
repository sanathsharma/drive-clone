"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useId } from "react";
import * as fileActions from "@/actions/files";
import * as folderActions from "@/actions/folders";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { handleSubmit, useActionWithReset } from "@/lib/form";
import { toErrorsMap } from "@/lib/form-errors";
import type { Row } from "./table/types";

type Props = {
	row: Row;
	parentId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const initialState = { errors: {}, success: false };

export function RenameDialog({ row, parentId, open, onOpenChange }: Props) {
	const t = useTranslations("content.rename-dialog");
	const renameAction = row.type === "folder" ? folderActions.renameFolder : fileActions.renameFile;
	const [formRef, boundAction] = useActionWithReset(renameAction.bind(null, row.id, parentId));
	const [state, action, isPending] = useActionState(boundAction, initialState);
	const nameId = useId();

	// `onOpenChange` updates a different component's state (the dropdown that owns `open`),
	// so this has to be an effect, not an in-render state adjustment - the latter is only
	// safe for a component adjusting its own state during its own render.
	useEffect(() => {
		if (state.success) {
			onOpenChange(false);
		}
	}, [state, onOpenChange]);

	const errorsMap = toErrorsMap(state.errors);

	return (
		<Dialog
			onOpenChange={onOpenChange}
			open={open}
		>
			<DialogContent>
				<form
					onSubmit={handleSubmit(action)}
					ref={formRef}
				>
					<DialogHeader>
						<DialogTitle>{t("title", { name: row.name })}</DialogTitle>
						<DialogDescription>{t("description")}</DialogDescription>
					</DialogHeader>

					<FieldGroup className="py-4">
						<Field>
							<FieldLabel htmlFor={nameId}>{t("name-label")}</FieldLabel>
							<Input
								aria-invalid={errorsMap.has("name")}
								autoFocus
								defaultValue={row.name}
								id={nameId}
								key={row.name}
								name="name"
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
