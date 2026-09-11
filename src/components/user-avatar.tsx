"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/client";
import logger from "@/lib/logger";
import { getInitials } from "@/lib/string";

export default function UserAvatar() {
	const { data, error, isLoading } = useSession();

	if (isLoading) {
		return <Skeleton className="size-8 rounded-full" />;
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
