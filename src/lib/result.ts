export type Result<T, E = unknown> = { data: T; error: null } | { error: E; data: null };

export function Ok<T>(data: T): Result<T, never> {
	return { data, error: null };
}

export function Err<E>(error: E): Result<never, E> {
	return { data: null, error };
}
