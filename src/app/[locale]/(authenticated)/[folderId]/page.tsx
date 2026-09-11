import FolderBreadcrumbs from "@/components/folder-breadcrumbs";

type Props = {
	params: Promise<{ folderId?: string }>;
};

export default async function FolderPage({ params }: Props) {
	const { folderId } = await params;

	return (
		<div className="main main--w-full main--h-header">
			<FolderBreadcrumbs folderId={folderId} />
		</div>
	);
}
