import { createActorContext } from "@xstate/react";
import sessionMachine from "./session-machine";

const AuthContext = createActorContext(sessionMachine);

export { AuthContext };
