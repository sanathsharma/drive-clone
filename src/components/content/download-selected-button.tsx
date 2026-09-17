"use client";

import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useContentArea } from "@/components/content/area";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { triggerDownload } from "@/lib/trigger-download";

export function DownloadSelectedButton() {
	const t = useTranslations("content.download");
	const area = useContentArea();
	const [isPending, startTransition] = useTransition();

	if (!area) {
		return null;
	}

	const count = area.selected.size;

	const onClick = () => {
		const items = Array.from(area.selected, ([id, type]) => ({ id, type }));

		startTransition(async () => {
			try {
				await toast.promise(triggerDownload({ fallbackFilename: "download.zip", items }), {
					error: () => t("download-selected-failed"),
					loading: t("preparing"),
					success: () => t("downloaded-count", { count }),
				});
			} catch {
				// toast.promise already surfaced the error toast.
			}
		});
	};

	return (
		<Button
			disabled={isPending}
			onClick={onClick}
			variant="outline"
		>
			<DownloadIcon />
			{t("download-count", { count })}
		</Button>
	);
}
