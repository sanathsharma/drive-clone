"use client";

import { createContext, type DragEventHandler, useCallback, useContext, useState } from "react";

export const DragCountContext = createContext(0);

export function useDragCountCallbacks() {
	const [dragCount, setDragCount] = useState(0);

	const onDragEnter: DragEventHandler<HTMLElement> = useCallback((event) => {
		const items = event.dataTransfer?.items;
		if (items) {
			// count only items that are files (ignores dragged text, etc.)
			const fileCount = Array.from(items).filter((i) => i.kind === "file").length;
			setDragCount(fileCount);
		}
	}, []);

	const onDragLeave = useCallback(() => setDragCount(0), []);
	const onDrop = useCallback(() => setDragCount(0), []);

	return {
		dragCount,
		onDragEnter,
		onDragLeave,
		onDrop,
	};
}

export const useDragCount = () => {
	return useContext(DragCountContext);
};
