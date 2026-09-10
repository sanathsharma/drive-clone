import { cache } from "react";
import { type Result, Unauthenticated } from "@/lib/api-errors";
import { auth } from "@/lib/auth/server";
import { Err, Ok } from "@/lib/result";

type User = Awaited<ReturnType<typeof auth.getSession>>["data"]["user"];

export const getUser = cache(async (): Promise<Result<User>> => {
	const { data, error } = await auth.getSession();
	if (error || !data) {
		const err = new Unauthenticated().setDebugCtx({ error });

		return Err(err);
	}

	return Ok(data.user);
});