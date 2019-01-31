import Transition from "../Transition/Transition";
class State {
	public id: number;
	private transitions : Set<Transition>;
	constructor (id: number) {
		this.id = id;
		this.transitions = new Set<Transition>();
	}

	addTransition = (t: Transition) => {
		this.transitions.add(t);
	}
}

export default State;