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
	getToken = () => {};

	/**
	 * Regresa un lexema dado a la pila de lexemas.
	 *
	 * @param {string} lexem
	 * @memberof LexicAnalyzer
	 */
	returnToken = () => {};

	/**
	 * Separa la entrada dada en un arreglo de lexemas con su token asociado.
	 *
	 * @param {string} input
	 * @memberof Misc
	 */
	public lexicAnalysis(input: string) {
		let i: number = 0;
		let j: number = 0;
		this.state = this.automaton.startState;
		this.acceptStatesSeen.clear();
		this.indexStart = 0;
		this.indexEnd = 0;
		this.transiciones = [];
		let errorFlag: boolean = false;
		while (i < input.length) {
			if (this.state.getTransitionsBySymbol(input[i]).length > 0) {
				this.transiciones = this.state.getTransitionsBySymbol(input[i]);
				this.state = [...this.transiciones][0].getTargetState(); //Se asume que solo se tuvo una transicion
				i++;
				if ([...this.automaton.acceptStates].includes(this.state)){
					this.acceptStatesSeen.add(this.state);
					this.indexEnd = i;
				}
			}
			else {
				if (this.acceptStatesSeen.size === 0) {
					alert("ERROR léxico en " + i);
					errorFlag = true;
					break;
				} 
				else{
					this.setLexems(j, this.indexStart, this.indexEnd, input, this.state);
					j++;
					this.indexStart = this.indexEnd;
					this.state = this.automaton.startState;
					this.acceptStatesSeen.clear();
				}
			}
		}
		if(i == input.length) this.setLexems(j, this.indexStart, this.indexEnd, input, this.state);
		if(!errorFlag) alert("CADENA CORRECTA");
	}

	public setLexems(j: number, indexStart: number, indexEnd: number, input: string, state){
		this.lexems[j] = [
			input.substring(indexStart, indexEnd),
			state.getToken()
		]; //Se guarda el caracter y el token
		console.log("Se recibio un token [" + this.state.getToken() + "]");
	}
}

export { LexicAnalyzer };
