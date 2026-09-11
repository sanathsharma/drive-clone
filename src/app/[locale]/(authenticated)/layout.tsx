import AppHeader from "@/components/app-header";

export default async function AuthenticatedLayout({ children }: React.ComponentProps<"div">) {
	return (
		<>
			<AppHeader />
			{children}
		</>
	);
}
