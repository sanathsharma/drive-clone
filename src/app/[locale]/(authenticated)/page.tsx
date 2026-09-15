import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";
import logger from "@/lib/logger";
import { get } from "@/services/content";

export default async function Home() {
	const { data, error } = await get();
	if (error) {
		logger.error(error);
	}

	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<Content.ContentArea>
				<div className="flex items-center justify-between gap-2">
					<FolderBreadcrumbs />
					<Content.ActionsPanel />
				</div>

				<Content.UploadDropzone folderName="My Drive">
					<Content.ContentTable
						files={data?.files ?? []}
						folders={data?.folders ?? []}
					/>
				</Content.UploadDropzone>
			</Content.ContentArea>
		</div>
	);
}
