import State from "../State/State";
class Automaton {
	private sigma: string[];
	private startState: State;
	private states: State[];
	private acceptStates: State[];

	constructor(
		sigma: string[],
		startState: State,
		states: State[],
		acceptStates: State[]
	) {
		this.sigma = sigma;
		this.startState = startState;
		this.states = states;
		this.acceptStates = acceptStates;
		console.log("Autómata creado.");
	}

	toString = () => {
		const sigmaString = this.sigma.reduce((total, current) => `${total} ${current}, `, "");
		const startString: string = this.startState.id;
		const acceptString: string = this.acceptStates
			.map(state => state.id)
			.reduce((total, current) => `${total} ${current}, `, "");
		const statesString: string = this.states
			.map(state => state.id)
			.reduce((total, current) => `${total} ${current}, `, "");

		return `Automaton: states= {${statesString}}, sigma={${sigmaString}}, start={${startString}}, accept={${acceptString}}`;
	}
}

export default Automaton;
