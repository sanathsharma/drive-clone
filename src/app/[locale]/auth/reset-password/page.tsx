import { notFound } from "next/navigation";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/reset-password-form";

type Props = {
	searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Wrapper searchParams={searchParams} />
		</Suspense>
	);
}

async function Wrapper({ searchParams }: Props) {
	const { token } = await searchParams;

	if (!token) {
		notFound();
	}

	return <ResetPasswordForm token={token} />;
}