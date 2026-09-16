import Image from "next/image";
import UserDropdown from "@/components/user-dropdown";
import { Link } from "@/i18n/navigation";

export default async function AppHeader() {
	return (
		<div className="flex items-center justify-between h-(--header-height) px-4">
			<Link
				className="focus-visible:c_outline-2 rounded-xs"
				href="/"
			>
				<Image
					alt="Drive"
					height={24}
					loading="eager"
					src="/logo.svg"
					width={24}
				/>
			</Link>
			<UserDropdown />
		</div>
	);
}