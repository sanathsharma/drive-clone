import * as rootParams from "next/root-params";
import * as actions from "@/actions/auth";

export default async function AuthenticatedLayout({ children }: React.ComponentProps<"div">) {
	const locale = await rootParams.locale();
	const signOut = actions.signOut.bind(null, locale);

	return (
		<div>
			<form action={signOut}>
				<button type="submit">Sign out</button>
			</form>
			{children}
		</div>
	);
}
