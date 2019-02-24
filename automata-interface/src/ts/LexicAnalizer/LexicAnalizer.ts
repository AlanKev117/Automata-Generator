import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";

class LexicAnalyzer {
	private automaton: Automaton;
	private lexems: [string, number][];
	private acceptStatesSeen: Set<State>;
	private indexStart: number;
	private indexEnd: number;
	private transiciones: Transition[];
	private state: State;

	constructor(automata: Automaton[], tokens: Object, lexicName: string) {
		const copies = automata.map(auto => auto.copy());
		copies.forEach(auto => {
			auto.setToken(tokens[auto.getName()]);
		});

		// Inicialización para el algoritmo.
		this.automaton = Misc.afnToAfd(Misc.unirAFNAnalisis(copies, lexicName));
		this.lexems = [];
		this.acceptStatesSeen = new Set<State>();
		this.acceptStatesSeen.clear();
		this.indexStart = 0;
		this.indexEnd = 0;
		this.transiciones = [];
		this.state = this.automaton.startState;
	}

	getAutomaton = () => this.automaton;
	getLexems = () => this.lexems;

	/**
	 * Obtiene el siguiente lexema que idetifica el analizador.
	 *
	 * @returns {string}
	 * @memberof LexicAnalyzer
	 */
	getLexem = () => {};

	/**
	 * Regresa un lexema dado a la pila de lexemas.
	 *
	 * @param {string} lexem
	 * @memberof LexicAnalyzer
	 */
	pushLexem = (lexem: string) => {};

	/**
	 * Separa la entrada dada en un arreglo de lexemas con su token asociado.
	 *
	 * @param {string} input
	 * @returns {[string, number][]}
	 * @memberof Misc
	 */
	public lexicAnalysis(input: string) {
		let i: number = 0;
		let j: number = 0;
		while (i < input.length) {
			if (this.state.getTransitionsBySymbol(input[i])) {
				this.transiciones = this.state.getTransitionsBySymbol(input[i]);
				this.state = [...this.transiciones][0].getTargetState(); //Se asume que solo se tuvo una transicion
				i++;
				if ([...this.automaton.acceptStates].includes(this.state)) {
					this.acceptStatesSeen.add(this.state);
					this.indexEnd = i;
				}
			} else {
				if (this.acceptStatesSeen.size === 0) {
					console.log("ERROR léxico en " + i);
					// i++;
				} else {
					this.lexems[j] = [
						input.substring(this.indexStart, this.indexEnd),
						this.state.getToken()
					]; //Se guarda el caracter y el token
					j++;
					this.indexStart = this.indexEnd;
				}
			}
		}
	}
}

export { LexicAnalyzer };
