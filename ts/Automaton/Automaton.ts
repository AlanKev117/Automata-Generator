import State from "../State/State";
import Transition from "../Transition/Transition";

class Automaton {
	private sigma: Set<string>;
	private states: Set<State>;
	private startState: State;
	private acceptStates: Set<State>;

	constructor() {
		this.sigma = new Set<string>();
		this.states = new Set<State>();
		this.startState = null;
		this.acceptStates = new Set<State>();
	}

	createBasic = (symbol: number, limit?: string) => {
		this.states.add(new State(0));
		this.states.add(new State(symbol));
		this.states[3];
		//this.states = [new State()]
	};

	toString = () => {
		const sigmaString = [...this.sigma].reduce(
			(total, current) => `${total} ${current}, `,
			""
		);
		const startString: string = "" + this.startState.id;
		const acceptString: string = [...this.acceptStates]
			.map(state => state.id)
			.reduce((total, current) => `${total} ${current}, `, "");
		const statesString: string = [...this.states]
			.map(state => state.id)
			.reduce((total, current) => `${total} ${current}, `, "");

		return `Automaton: states= {${statesString}}, sigma={${sigmaString}}, start={${startString}}, accept={${acceptString}}`;
	};
}

export default Automaton;
