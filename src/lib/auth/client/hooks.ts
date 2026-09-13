import { queryOptions, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { authClient } from ".";
import { AuthContext } from "./context";

export const useUser = () => {
	const user = AuthContext.useSelector((state) => state.context.session?.user);
	return user;
};

export const useAuthStatus = () => {
	const authStatus = AuthContext.useSelector((state) => state.value);
	return authStatus;
};

export const useIsAutenticated = () => {
	const authStatus = useAuthStatus();
	return authStatus === "authenticated";
};

export const useInvalidateSession = () => {
	const actor = AuthContext.useActorRef();
	return () => actor.send({ type: "INVALIDATE" });
};

export type Session = typeof authClient.$Infer.Session;

const getSessionOptions = () => {
	return queryOptions<Session>({
		queryFn: async () => {
			const result = await authClient.getSession();

			if (result.error) {
				throw result.error;
			}

			if (!result.data) {
				throw new Error("No active session");
			}

			return result.data;
		},
		queryKey: ["session"],
	});
};

export const useSession = <T = Session>(select?: (session: Session) => T) => {
	return useQuery({ ...getSessionOptions(), select });
};

export const invalidateSession = () => {
	const queryClient = getQueryClient();
	return queryClient.invalidateQueries({ queryKey: getSessionOptions().queryKey });
};

export const refetchSession = () => {
	const queryClient = getQueryClient();
	return queryClient.refetchQueries({ queryKey: getSessionOptions().queryKey });
};
