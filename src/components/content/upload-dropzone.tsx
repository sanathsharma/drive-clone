"use client";

import { useTranslations } from "next-intl";
import type { DropzoneOptions } from "react-dropzone";
import { Content, Root } from "@/components/content/drag-active";
import { Dropzone } from "@/components/content/dropzone";
import { isFromDirectory, uploadFile } from "@/components/content/upload";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";

type Props = {
	folderName: string;
	parentId?: string;
	children?: React.ReactNode;
};

export function UploadDropzone({ folderName, parentId, children }: Props) {
	const t = useTranslations("upload-files");
	const router = useRouter();

	const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles) => {
		for (const file of acceptedFiles) {
			if (isFromDirectory(file)) {
				toast.add({ title: t("folder-rejected"), type: "error" });
				continue;
			}

			toast.promise(
				uploadFile(file, parentId).then(() => router.refresh()),
				{
					error: (err) => ({
						description: err instanceof Error ? err.message : undefined,
						title: t("upload-failed", { name: file.name }),
						type: "error",
					}),
					loading: { title: t("uploading", { name: file.name }), type: "loading" },
					success: { title: t("uploaded", { name: file.name }), type: "success" },
				},
			);
		}
	};

	return (
		<Dropzone
			dragActive={
				<Root>
					<Content folderName={folderName} />
				</Root>
			}
			onDrop={onDrop}
		>
			{children}
		</Dropzone>
	);
}
