import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";
import logger from "@/lib/logger";
import { get } from "@/services/content";

type Props = {
	folderId?: string;
};

export async function MyDrive({ folderId }: Props = {}) {
	const { data, error } = await get(folderId);
	if (error) {
		logger.error(error);
	}

	return (
		<Content.ContentArea>
			<div className="flex items-center justify-between gap-2">
				<FolderBreadcrumbs folderId={folderId} />
				<Content.ActionsPanel parentId={folderId} />
			</div>

			<Content.UploadDropzone
				folderName={folderId ? "this folder" : "My Drive"}
				parentId={folderId}
			>
				<Content.ContentTable
					files={data?.files ?? []}
					folders={data?.folders ?? []}
					parentId={folderId}
				/>
			</Content.UploadDropzone>
		</Content.ContentArea>
	);
}