import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";

interface CameraToolGuiInstance extends ScreenGui {
	ImageLabel: ImageLabel;
}

interface CameraToolInstance extends Tool {}

interface Attributes {}

@Component({
	tag: "CameraTool",
})
export class CameraTool extends BaseComponent<Attributes, CameraToolInstance> implements OnStart {
	private camera = Workspace.CurrentCamera;
	private movementSpeed = 0.5;
	private connection?: RBXScriptConnection;

	onStart() {
		this.instance.Equipped.Connect(() => this.onEquipped());
		this.instance.Unequipped.Connect(() => this.onUnequipped());
	}

	private onEquipped() {
		if (!this.camera) return;

		const player = Players.LocalPlayer;
		const character = player.Character;
		if (!character) return;

		this.toggleGui(true);

		// Set camera to Scriptable mode
		this.camera.CameraType = Enum.CameraType.Scriptable;

		// Lock mouse to center
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

		// Connect to RenderStepped to update camera position
		this.connection = RunService.RenderStepped.Connect((deltaTime) => this.updateCamera(deltaTime));
	}

	private onUnequipped() {
		if (!this.camera) return;

		this.toggleGui(false);

		// Restore default camera settings
		this.camera.CameraType = Enum.CameraType.Custom;
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;

		// Disconnect the RenderStepped connection
		if (this.connection) {
			this.connection.Disconnect();
			this.connection = undefined;
		}
	}

	private toggleGui(enabled: boolean) {
		const player = Players.LocalPlayer;
		const playerGui = player.FindFirstChildOfClass("PlayerGui");
		if (!playerGui) return;

		const cameraToolGui = playerGui.FindFirstChild("CameraToolGui") as CameraToolGuiInstance;
		cameraToolGui.Enabled = enabled;
	}

	private updateCamera(deltaTime: number) {
		if (!this.camera) return;

		// Get mouse delta
		const delta = UserInputService.GetMouseDelta();
		const rotation = new CFrame(0, 0, 0)
			.mul(CFrame.Angles(0, -delta.X * 0.002, 0))
			.mul(CFrame.Angles(-delta.Y * 0.002, 0, 0));

		// Update camera CFrame
		this.camera.CFrame = rotation.mul(this.camera.CFrame);

		// Handle movement input (WASD)
		let moveDirection = new Vector3(0, 0, 0);
		if (UserInputService.IsKeyDown(Enum.KeyCode.W))
			moveDirection = moveDirection.add(this.camera.CFrame.LookVector);
		if (UserInputService.IsKeyDown(Enum.KeyCode.S))
			moveDirection = moveDirection.sub(this.camera.CFrame.LookVector);
		if (UserInputService.IsKeyDown(Enum.KeyCode.A))
			moveDirection = moveDirection.sub(this.camera.CFrame.RightVector);
		if (UserInputService.IsKeyDown(Enum.KeyCode.D))
			moveDirection = moveDirection.add(this.camera.CFrame.RightVector);

		// Normalize movement direction
		if (moveDirection.Magnitude > 0) {
			moveDirection = moveDirection.Unit.mul(this.movementSpeed * deltaTime);
			this.camera.CFrame = this.camera.CFrame.add(moveDirection);
		}
	}
}
