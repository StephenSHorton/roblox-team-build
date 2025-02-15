import Signal from "@rbxts/signal";

export const onGameStarted = new Signal();
export const onSetupFinished = new Signal<(redTeam: Array<Player>, blueTeam: Array<Player>) => void>();
export const onGameFinished = new Signal();
