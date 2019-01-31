import Transition from "../Transition/Transition";
class State {
	public id: string;
	private transitions : Transition[];
	constructor (id: string) {
		this.id = id;
		this.transitions = [];
	}
}

export default State;