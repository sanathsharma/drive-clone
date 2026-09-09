import { assertEvent, assign, type DoneActorEvent, fromPromise, setup } from "xstate";
import { authClient } from ".";

export type Session = typeof authClient.$Infer.Session;

const promise = fromPromise<Session>(async () => {
	const result = await authClient.getSession();

	if (result.error) {
		throw result.error;
	}

	if (!result.data) {
		throw new Error("No active session");
	}

	return result.data;
});

type Context = {
	session?: Session;
};

type Events = DoneActorEvent<Session, "promise"> | { type: "INVALIDATE" };

const defaultContext: Context = {};

const sessionMachine = setup({
	actions: {
		clearSession: assign(() => {
			return {
				session: undefined,
			};
		}),
		setSession: assign(({ event }) => {
			assertEvent(event, "xstate.done.actor.promise");
			return {
				session: event.output,
			};
		}),
	},
	actors: { promise },
	types: {
		context: {} as Context,
		events: {} as Events,
	},
}).createMachine({
	context: defaultContext,
	id: "session",
	initial: "unknown",
	states: {
		authenticated: {
			on: {
				INVALIDATE: "unknown",
			},
		},
		unauthenticated: {
			on: {
				INVALIDATE: "unknown",
			},
		},
		unknown: {
			invoke: {
				id: "promise",
				onDone: {
					actions: "setSession",
					target: "authenticated",
				},
				onError: {
					actions: "clearSession",
					target: "unauthenticated",
				},
				src: "promise",
			},
		},
	},
});

export default sessionMachine;
