import State from "../State/State";
class Automaton {
	private sigma: string[];
	private startState: State;
	private states: State[];
	private acceptStates: State[];

	constructor (sigma: string[], startState: State, states: State[], acceptStates: State[]) {
		this.sigma = sigma;
		this.startState = startState;
		this.states = states;
		this.acceptStates = acceptStates;
	}
}

export default Automaton;