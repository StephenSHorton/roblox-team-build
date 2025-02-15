import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

interface CameraToolGuiInstance extends ScreenGui {
	ImageLabel: ImageLabel;
}

interface CameraToolInstance extends Tool {}

interface Attributes {}

@Component({
	tag: "CameraTool",
})
export class CameraTool extends BaseComponent<Attributes, CameraToolInstance> implements OnStart {
	onStart() {
		this.instance.Equipped.Connect(() => {
			const localPlayer = Players.LocalPlayer;
			const playerGui = localPlayer.FindFirstChildOfClass("PlayerGui");
			if (!playerGui) return;

			const cameraToolGui = playerGui.FindFirstChild("CameraToolGui") as CameraToolGuiInstance;
		});
	}
}
