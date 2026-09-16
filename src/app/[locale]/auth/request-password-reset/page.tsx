import { Suspense } from "react";
import EmailSent from "@/components/auth/email-sent";
import RequestPasswordResetForm from "@/components/auth/request-password-reset-form";

type Props = {
	searchParams: Promise<{ code: string; email: string }>;
};

const EMAIL_SENT = "EMAIL_SENT";

export default async function RequestPasswordResetPage({ searchParams }: Props) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Wrapper searchParams={searchParams} />
		</Suspense>
	);
}

export async function Wrapper({ searchParams }: Props) {
	const { code, email } = await searchParams;

	if (code === EMAIL_SENT && email) {
		return <EmailSent email={email} />;
	}

	return <RequestPasswordResetForm />;
}
