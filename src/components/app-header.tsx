import Image from "next/image";
import * as rootParams from "next/root-params";
import * as actions from "@/actions/auth";
import { Link } from "@/i18n/navigation";
import UserAvatar from "./user-avatar";

export default async function AppHeader() {
	const locale = await rootParams.locale();
	const signOut = actions.signOut.bind(null, locale);

	// <form action={signOut}>
	// 	<button type="submit">Sign out</button>
	// </form>
	return (
		<div className="flex items-center justify-between h-(--header-height) px-4">
			<Link
				className="focus:c_outline-2"
				href="/"
			>
				<Image
					alt="Drive"
					height={24}
					src="/logo.svg"
					width={24}
				/>
			</Link>
			<UserAvatar />
		</div>
	);
}
