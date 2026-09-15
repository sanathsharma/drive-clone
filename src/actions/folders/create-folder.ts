"use server";

import { type } from "arktype";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { paths } from "@/constants/paths";
import { toFieldErrors } from "@/lib/form-errors";
import { createFolder as createFolderService } from "@/services/folders";

const schema = type({
	name: "string.trim |> 1 <= string <= 255",
});

type FormState = {
	errors: {
		name?: { message: string }[];
		_form?: { message: string }[];
	};
	success: boolean;
};

export async function createFolder(parentId: string | undefined, _: FormState, formData: FormData): Promise<FormState> {
	const data = Object.fromEntries(formData);
	const t = await getTranslations("content.create-folder-dialog");

	const result = schema(data);
	if (result instanceof type.errors) {
		return { errors: toFieldErrors(result, t), success: false };
	}

	const { error } = await createFolderService({ name: result.name, parent_id: parentId ?? null });
	if (error) {
		return { errors: { _form: [{ message: t("failed") }] }, success: false };
	}

	revalidatePath(parentId ? paths.folder(parentId) : paths.root());
	return { errors: {}, success: true };
}
