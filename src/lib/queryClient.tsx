"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { ReactNode } from "react";

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	// Keep server requests isolated and preserve the browser cache across renders.
	if (typeof window === "undefined") return new QueryClient();
	browserQueryClient ??= new QueryClient();
	return browserQueryClient;
}

export function Provider({ children }: { children: ReactNode }) {
	return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
