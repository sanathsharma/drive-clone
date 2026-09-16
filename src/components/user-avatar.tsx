"use client";

import { useLocale } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/constants/paths";
import { redirect } from "@/i18n/navigation";
import { NO_ACTIVE_SESSION_ERROR, useSession } from "@/lib/auth/client";
import logger from "@/lib/logger";
import { getInitials } from "@/lib/string";

export default function UserAvatar() {
	const { data, error, isLoading } = useSession();
	const locale = useLocale();

	if (isLoading) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	if (error === NO_ACTIVE_SESSION_ERROR) {
		return redirect({
			href: paths.auth.signIn(),
			locale,
		});
	}

	if (error) {
		logger.error(error);
		return null;
	}

	if (!data) {
		logger.warn("User not found in session");
		return null;
	}

	const { user } = data;

	return (
		<Avatar>
			{user.image && (
				<AvatarImage
					alt={user.name}
					className="grayscale"
					src={user.image}
				/>
			)}
			<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
		</Avatar>
	);
}
