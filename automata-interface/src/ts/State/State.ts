import { Transition } from "../Transition/Transition";
class State {
	private id: number;
	private transitions: Set<Transition>;
	private token: number;
	private lexicClass: string;

	/**
	 * Crea un estado.
	 *
	 * @param id {identidiacdor del estado}
	 */
	constructor(id: number) {
		this.id = id;
		this.transitions = new Set<Transition>();
	}

	// Getters
	public readonly getId = () => this.id;
	public readonly getTransitions = () => this.transitions;
	public readonly getToken = () => this.token;
	public readonly getLexicClass = () => this.lexicClass;

	// Setters
	public readonly setId = (id: number) => {
		this.id = id;
	};

	public readonly setToken = (token: number) => {
		this.token = token;
	};

	public readonly setLexicClass = (lexicClass: string) => {
		this.lexicClass = lexicClass;
	}

	/**
	 * Agrega una transición al conjunto de transiciones del estado.
	 *
	 * @param {Transition} t {transición a ser agregada}
	 * @memberof State
	 */
	public readonly addTransition = (t: Transition) => {
		this.transitions.add(t);
	};

	/**
	 * Obtiene el subconjunto del conjunto de transiciones que tengan el símbolo symbol.
	 *
	 * @param {string} symbol {símbolo con el que se hace la transición}
	 * @memberof State
	 */
	public getTransitionsBySymbol = (symbol: string) => {
		return [...this.transitions].filter(transition => {
			if (transition.hasLimitSymbol()) {
				return symbol.length === 1
					? transition.getSymbol() <= symbol &&
							symbol <= transition.getLimitSymbol()
					: false;
			} else {
				return transition.getSymbol() === symbol;
			}
		});
	};
}

export { State };
