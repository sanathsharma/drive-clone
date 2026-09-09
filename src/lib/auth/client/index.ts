"use client";

import { createAuthClient } from "@neondatabase/auth/next";
import { AuthContext } from "./context";

export const authClient = createAuthClient();

export * from "./hooks";
export type { Session } from "./session-machine";

export const AuthProvider = AuthContext.Provider;
