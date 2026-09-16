import { Suspense } from "react";
import { MyDrive } from "@/components/my-drive";
import { MyDriveSkeleton } from "@/components/my-drive-skeleton";

type Props = {
	params: Promise<{ folderId?: string }>;
};

async function FolderDrive({ params }: Props) {
	const { folderId } = await params;

	return <MyDrive folderId={folderId} />;
}

export default async function FolderPage({ params }: Props) {
	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<Suspense fallback={<MyDriveSkeleton crumbCount={2} />}>
				<FolderDrive params={params} />
			</Suspense>
		</div>
	);
}
