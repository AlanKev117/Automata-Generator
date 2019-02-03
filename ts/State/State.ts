import Transition from "../Transition/Transition";
class State {
	public readonly id: number;
	public readonly transitions: Set<Transition>;

	/**
	 * Crea un estado.
	 *
	 * @param id {identidiacdor del estado}
	 */
	constructor(id: number) {
		this.id = id;
		this.transitions = new Set<Transition>();
	}

	/**
	 * Agrega una transición al conjunto de transiciones del estado.
	 *
	 * @param {Transition} t {transición a ser agregada}
	 * @memberof State
	 */
	addTransition = (t: Transition) => {
		this.transitions.add(t);
	};

	/**
	 * Obtiene el subconjunto del conjunto de transiciones que tengan el símbolo symbol.
	 *
	 * @param {string} symbol {símbolo con el que se hace la transición}
	 * @memberof State
	 */
	public getTransitionsBySymbol = (symbol: string) => {
		return [...this.transitions].filter( transition => {
			if (transition.hasLimitSymbol()) {
				return symbol.length === 1 ? transition.symbol <= symbol && symbol <= transition.limitSymbol : false;
			} else {
				return transition.symbol === symbol;
			}
		});
	};
}

export default State;
