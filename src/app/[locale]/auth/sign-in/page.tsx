import { Suspense } from "react";
import { ShowMessageToast } from "@/components/auth/show-message-toast";
import SignInForm from "@/components/auth/sign-in-form";

export default async function SignInPage() {
	return (
		<>
			<Suspense>
				<ShowMessageToast />
			</Suspense>
			<SignInForm />
		</>
	);
}
