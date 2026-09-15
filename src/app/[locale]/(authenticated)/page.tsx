import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";

export default async function Home() {
	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<FolderBreadcrumbs />

			<Content.UploadDropzone folderName="My Drive" />
		</div>
	);
}
