import FolderBreadcrumbs from "@/components/folder-breadcrumbs";

export default async function Home() {
	return (
		<div className="main main--w-full main--h-header">
			<FolderBreadcrumbs />
		</div>
	);
}
