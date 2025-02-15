import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";
import { onSetupFinished } from "server/signals";

const MIN_PLAYERS = 1;
const INTERMISSION = 15;

@Service({})
export class GameService implements OnStart {
	private gameIsStarted = false;
	private playerList: Map<Player["UserId"], Player> = new Map();

	onStart() {
		Players.PlayerAdded.Connect((player) => {
			this.playerList.set(player.UserId, player);
			this.onPlayerListChanged();
		});

		Players.PlayerRemoving.Connect((player) => {
			this.playerList.delete(player.UserId);
			this.onPlayerListChanged();
		});

		onSetupFinished.Connect((redTeam, blueTeam) => this.onSetupFinished(redTeam, blueTeam));
	}

	startGame() {
		this.gameIsStarted = true;
		print("Starting game...");

		this.waitIntermission(INTERMISSION);
	}

	private onPlayerListChanged() {
		if (this.gameIsStarted) return;
		if (this.playerList.size() >= MIN_PLAYERS) {
			this.startGame();
		}
	}

	private waitIntermission(seconds: number) {
		for (let i = seconds; i > 0; i--) {
			Events.intermissionTick.broadcast(i);
			task.wait(1);
		}
	}

	private onSetupFinished(redTeam: Array<Player>, blueTeam: Array<Player>) {}
}
