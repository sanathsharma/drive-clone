import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect: _redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

function redirect(...args: Parameters<typeof _redirect>): never {
	return _redirect(...args) as never;
}

export { redirect };
