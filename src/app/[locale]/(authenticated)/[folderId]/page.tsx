import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";

type Props = {
	params: Promise<{ folderId?: string }>;
};

export default async function FolderPage({ params }: Props) {
	const { folderId } = await params;

	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<FolderBreadcrumbs folderId={folderId} />

			<Content.UploadDropzone
				folderName="this folder"
				parentId={folderId}
			/>
		</div>
	);
}
