import { OnStart, Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { onGameStarted, onSetupFinished } from "server/signals";

interface TeamStage extends Model {
	Baseplate: Part;
}

const redStage = Workspace.WaitForChild("RedStage") as TeamStage;
const blueStage = Workspace.WaitForChild("BlueStage") as TeamStage;

@Service({})
export class SetupService implements OnStart {
	onStart() {
		onGameStarted.Connect(() => this.onGameStarted());
	}

	private onGameStarted() {
		// Divide players into 2 teams
		const redTeam = new Array<Player>();
		const blueTeam = new Array<Player>();

		// Pivot player characters to their corresponding stage baseplate

		// Give them F3X build tools

		onSetupFinished.Fire(redTeam, blueTeam);
	}
}
