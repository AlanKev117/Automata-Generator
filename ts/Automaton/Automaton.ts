import State from "../State/State";
import Transition from "../Transition/Transition";

class Automaton {
	private sigma: Set<string>;
	private states: Set<State>;
	private startState: State;
	private acceptStates: Set<State>;

	constructor() {
		this.sigma = new Set<string>();
		this.sigma.clear();
		this.states = new Set<State>();
		this.states.clear();
		this.startState = null;
		this.acceptStates = new Set<State>();
		this.acceptStates.clear();
		console.log("Automata creado.");
	}

	createBasic = (symbol: string, limitSymbol?: string) => {
		const state0 = new State(0);
		const state1 = new State(1);
		const transition = new Transition(symbol, state1, limitSymbol);
		state0.addTransition(transition);
		let currentSymbol = symbol;

		// Se agregan los símbolos que abarca el rango (symbol, limitSymbol) a sigma.
		if (transition.hasLimitSymbol()) {
			for (let ascii = symbol.charCodeAt(0); ascii <= limitSymbol.charCodeAt(0); ascii++) {
				this.sigma.add(String.fromCharCode(ascii));
			}
		}
		// Agregamos los estados a los conjuntos y establecemos estados inicial y finales.
		this.states.add(state0);
		this.states.add(state1);
		this.startState = state0;
		this.acceptStates.add(state1);
	};

	private getState = (id: number, final?: boolean) => {
		if (final) {
			return [...this.acceptStates].filter(state => state.id === id)[0];
		}
		return [...this.states].filter(state => state.id === id)[0];	
	}

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
