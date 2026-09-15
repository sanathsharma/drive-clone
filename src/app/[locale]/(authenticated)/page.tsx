import * as Content from "@/components/content";
import FolderBreadcrumbs from "@/components/folder-breadcrumbs";

const { DragActive } = Content;

export default async function Home() {
	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<FolderBreadcrumbs />

			<Content.Dropzone
				dragActive={
					<DragActive.Root>
						<DragActive.Content folderName="My Drive" />
					</DragActive.Root>
				}
			/>
		</div>
	);
}
