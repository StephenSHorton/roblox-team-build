import { Networking } from "@flamework/networking";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	intermissionTick: (secondsRemaining: number) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
