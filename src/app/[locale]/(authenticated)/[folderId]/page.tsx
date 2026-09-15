import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";
import logger from "@/lib/logger";
import { get } from "@/services/content";

type Props = {
	params: Promise<{ folderId?: string }>;
};

export default async function FolderPage({ params }: Props) {
	const { folderId } = await params;

	const { data, error } = await get(folderId);
	if (error) {
		logger.error(error);
	}

	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<Content.ContentArea>
				<div className="flex items-center justify-between gap-2">
					<FolderBreadcrumbs folderId={folderId} />
					<Content.ActionsPanel parentId={folderId} />
				</div>

				<Content.UploadDropzone
					folderName="this folder"
					parentId={folderId}
				>
					<Content.ContentTable
						files={data?.files ?? []}
						folders={data?.folders ?? []}
						parentId={folderId}
					/>
				</Content.UploadDropzone>
			</Content.ContentArea>
		</div>
	);
}
