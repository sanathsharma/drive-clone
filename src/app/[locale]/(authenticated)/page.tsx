import { Suspense } from "react";
import { MyDrive } from "@/components/my-drive";

export default async function Home() {
	return (
		<div className="main main--w-full main--h-header flex flex-col gap-y-4">
			<Suspense fallback={<div>Loading...</div>}>
				<MyDrive />
			</Suspense>
		</div>
	);
}
