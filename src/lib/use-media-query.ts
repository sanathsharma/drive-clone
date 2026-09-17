import { useCallback, useSyncExternalStore } from "react";

function getServerSnapshot() {
	return false;
}

export function useMediaQuery(query: string) {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const mql = window.matchMedia(query);
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		},
		[query],
	);

	const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
