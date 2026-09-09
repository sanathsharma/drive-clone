"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";

export const ShowMessageToast = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const message = searchParams.get("message");

	useEffect(() => {
		if (!message) {
			return;
		}

		toast.add({
			description: message,
			onClose: () => {
				router.push({
					pathname,
					query: undefined,
				});
			},
			type: "success",
		});
	}, [message, pathname, router]);

	return null;
};
