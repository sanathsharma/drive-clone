export function clearCacheAndWait() {
	return new Promise<void>((resolve) => {
		const channel = new MessageChannel();
		channel.port1.onmessage = () => resolve();
		navigator.serviceWorker.controller?.postMessage({ type: "CLEAR_CACHE" }, [channel.port2]);
	});
}

export function clearCache() {
	return navigator.serviceWorker.controller?.postMessage({ type: "CLEAR_CACHE" });
}
