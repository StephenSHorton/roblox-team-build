import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";

const MIN_PLAYERS = 1;
const INTERMISSION = 15;

@Service({})
export class GameService implements OnStart {
	private playerList: Map<Player["UserId"], Player> = new Map();

	onStart() {
		Players.PlayerAdded.Connect((player) => {
			this.playerList.set(player.UserId, player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.playerList.delete(player.UserId);
		});
	}

	startGame() {
		print("Starting game...");

		this.waitIntermission(INTERMISSION);
	}

	private waitIntermission(seconds: number) {
		for (let i = seconds; i > 0; i--) {
			Events.intermissionTick.broadcast(i);
			task.wait(1);
		}
	}
}
