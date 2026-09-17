import { Suspense } from "react";
import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";
import { SkeletonBreadcrumb } from "@/components/skeletons";
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
			<div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Suspense fallback={<SkeletonBreadcrumb count={folderId ? 2 : 1} />}>
					<FolderBreadcrumbs folderId={folderId} />
				</Suspense>
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
