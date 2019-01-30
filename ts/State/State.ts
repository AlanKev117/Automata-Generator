import Transition from "../Transition/Transition";
class State {
	private id: string;
	private transitions : Transition[];
	constructor (id: string) {
		this.id = id;
		this.transitions = [];
	}
}

export default State;