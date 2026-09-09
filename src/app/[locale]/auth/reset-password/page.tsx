import { notFound } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

type Props = {
	searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
	const { token } = await searchParams;

	if (!token) {
		notFound();
	}

	return <ResetPasswordForm token={token} />;
}
