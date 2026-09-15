"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ContentType = "file" | "folder";

type ContentAreaContextValue = {
	selectMode: boolean;
	toggleSelectMode: () => void;
	exitSelectMode: () => void;
	selected: Map<string, ContentType>;
	toggleSelected: (id: string, type: ContentType) => void;
	toggleSelectAll: (items: { id: string; type: ContentType }[]) => void;
	openFilePicker: () => void;
	registerFilePicker: (open: (() => void) | null) => void;
	search: string;
	setSearch: (search: string) => void;
};

const ContentAreaContext = createContext<ContentAreaContextValue | null>(null);

export function useContentArea() {
	return useContext(ContentAreaContext);
}

type Props = {
	children?: React.ReactNode;
};

export function ContentArea({ children }: Props) {
	const [selectMode, setSelectMode] = useState(false);
	const [selected, setSelected] = useState<Map<string, ContentType>>(new Map());
	const [search, setSearch] = useState("");
	const filePickerRef = useRef<(() => void) | null>(null);

	const toggleSelectMode = useCallback(() => {
		setSelectMode((prev) => !prev);
		setSelected(new Map());
	}, []);

	const exitSelectMode = useCallback(() => {
		setSelectMode(false);
		setSelected(new Map());
	}, []);

	const toggleSelected = useCallback((id: string, type: ContentType) => {
		setSelected((prev) => {
			const next = new Map(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.set(id, type);
			}
			return next;
		});
	}, []);

	const toggleSelectAll = useCallback((items: { id: string; type: ContentType }[]) => {
		setSelected((prev) => {
			if (items.length > 0 && items.every((item) => prev.has(item.id))) {
				return new Map();
			}
			return new Map(items.map((item) => [item.id, item.type]));
		});
	}, []);

	const registerFilePicker = useCallback((open: (() => void) | null) => {
		filePickerRef.current = open;
	}, []);

	const openFilePicker = useCallback(() => {
		filePickerRef.current?.();
	}, []);

	const value = useMemo<ContentAreaContextValue>(
		() => ({
			exitSelectMode,
			openFilePicker,
			registerFilePicker,
			search,
			selected,
			selectMode,
			setSearch,
			toggleSelectAll,
			toggleSelected,
			toggleSelectMode,
		}),
		[
			exitSelectMode,
			openFilePicker,
			registerFilePicker,
			search,
			selectMode,
			selected,
			toggleSelectAll,
			toggleSelected,
			toggleSelectMode,
		],
	);

	return <ContentAreaContext.Provider value={value}>{children}</ContentAreaContext.Provider>;
}
