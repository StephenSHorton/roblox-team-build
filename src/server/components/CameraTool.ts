import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

interface CameraToolInstance extends Tool {
	Handle: Part & {
		Shutter: Sound;
	};
	FlashPart: Part & {
		SpotLight: SpotLight;
	};
}

interface Attributes {}

const ACTIVATION_INTERVAL = 1;

@Component({
	tag: "CameraTool",
})
export class CameraTool extends BaseComponent<Attributes, CameraToolInstance> implements OnStart {
	private activationDebounce = false;

	onStart() {
		const spotLight = this.instance.FlashPart.SpotLight;
		const shutter = this.instance.Handle.Shutter;
		this.instance.Activated.Connect(() => {
			if (this.activationDebounce) return;
			this.activationDebounce = true;

			task.defer(() => {
				task.wait(ACTIVATION_INTERVAL);
				this.activationDebounce = false;
			});

			spotLight.Enabled = true;
			shutter.Play();
			task.wait(0.1);
			spotLight.Enabled = false;
		});
	}
}
