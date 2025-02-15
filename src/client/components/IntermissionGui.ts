import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Events } from "client/network";

interface IntermissionGuiInstance extends ScreenGui {
	TextLabel: TextLabel;
}

interface Attributes {}

@Component({
	tag: "IntermissionGui",
})
export class IntermissionGui extends BaseComponent<Attributes, IntermissionGuiInstance> implements OnStart {
	onStart() {
		Events.intermissionTick.connect((secondsRemaining) => {
			if (secondsRemaining === 0) {
				this.instance.Enabled = false;
			} else {
				if (!this.instance.Enabled) this.instance.Enabled = true;
				this.instance.TextLabel.Text = tostring(secondsRemaining);
			}
		});
	}
}
