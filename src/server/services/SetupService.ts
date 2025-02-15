import { OnStart, Service } from "@flamework/core";
import { Players, ServerStorage, Teams, Workspace } from "@rbxts/services";
import { onGameStarted, onSetupFinished } from "server/signals";

interface TeamStage extends Model {
	Baseplate: Part;
}

const redStage = Workspace.WaitForChild("RedStage") as TeamStage;
const blueStage = Workspace.WaitForChild("BlueStage") as TeamStage;
const redTeamInstance = Teams.WaitForChild("Red") as Team;
const blueTeamInstance = Teams.WaitForChild("Blue") as Team;
const f3x = ServerStorage.WaitForChild("Building Tools");

@Service({})
export class SetupService implements OnStart {
	onStart() {
		onGameStarted.Connect(() => this.onGameStarted());
	}

	private onGameStarted() {
		// Divide players into 2 teams
		const players = Players.GetPlayers();
		const redTeam = new Array<Player>();
		const blueTeam = new Array<Player>();
		let number = 0;

		for (const player of players) {
			number++;
			if (number % 2 === 0) {
				redTeam.push(player);
				player.Team = redTeamInstance;
			}
			blueTeam.push(player);
			player.Team = blueTeamInstance;
		}

		// Pivot player characters to their corresponding stage baseplate

		for (const player of redTeam) {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			if (!character) continue;
			character.PivotTo(redStage.Baseplate.CFrame.add(new Vector3(0, 3, 0)));
			this.giveBuildingTools(character);
		}

		for (const player of blueTeam) {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			if (!character) continue;
			character.PivotTo(blueStage.Baseplate.CFrame.add(new Vector3(0, 3, 0)));
			this.giveBuildingTools(character);
		}

		// Give them F3X build tools

		onSetupFinished.Fire(redTeam, blueTeam);
	}

	private giveBuildingTools(character: Model) {
		const f3xClone = f3x.Clone();
		f3xClone.Parent = character;
	}
}
