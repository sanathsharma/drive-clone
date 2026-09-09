import { describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";

vi.mock(".", () => ({
	authClient: {
		getSession: vi.fn(),
	},
}));

import { authClient } from ".";
import sessionMachine from "./session-machine";

describe("sessionMachine", () => {
	it("transitions to authenticated with the resolved session on success", async () => {
		const session = { session: { id: "s1" }, user: { id: "1" } };
		vi.mocked(authClient.getSession).mockResolvedValue({
			data: session,
			error: null,
		});

		const actor = createActor(sessionMachine).start();

		await vi.waitFor(() => {
			expect(actor.getSnapshot().value).toBe("authenticated");
		});

		expect(actor.getSnapshot().context.session).toEqual(session);
	});

	it("transitions to unauthenticated when there is no active session", async () => {
		vi.mocked(authClient.getSession).mockResolvedValue({
			data: null,
			error: null,
		});

		const actor = createActor(sessionMachine).start();

		await vi.waitFor(() => {
			expect(actor.getSnapshot().value).toBe("unauthenticated");
		});

		expect(actor.getSnapshot().context.session).toBeUndefined();
	});

	it("transitions to unauthenticated when getSession errors", async () => {
		vi.mocked(authClient.getSession).mockResolvedValue({
			data: null,
			error: { message: "boom" },
		});

		const actor = createActor(sessionMachine).start();

		await vi.waitFor(() => {
			expect(actor.getSnapshot().value).toBe("unauthenticated");
		});

		expect(actor.getSnapshot().context.session).toBeUndefined();
	});
});
