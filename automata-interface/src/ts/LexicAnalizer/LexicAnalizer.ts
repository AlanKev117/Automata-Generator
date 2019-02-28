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
	private top: number;

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
	public getToken = () => {
		this.top++;
		return this.lexems[this.top - 1][1];
	}

	/**
	 * Regresa un lexema dado a la pila de lexemas.
	 *
	 * @param {string} lexem
	 * @memberof LexicAnalyzer
	 */
	public returnToken = () => {
		if(this.top > 0)
			this.top--;
		else console.log("ERROR: Subdesbordamiento de pila");
	}

	/**
	 * Separa la entrada dada en un arreglo de lexemas con su token asociado.
	 *
	 * @param {string} input
	 * @memberof Misc
	 */
	public lexicAnalysis(input: string) {
		let errorString: string;
		let i: number = 0;
		let j: number = 0;
		this.state = this.automaton.startState;
		this.acceptStatesSeen.clear();
		this.indexStart = 0;
		this.indexEnd = 0;
		this.transiciones = [];
		let errorFlag: boolean = false;
		let lexicErrors = new Array();
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
					console.log("ERROR léxico en " + i);
					lexicErrors.push(i);
					errorFlag = true;
					this.indexEnd--;
					this.indexStart++;
					i++;
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
		else{
			for(let n = 0; n < lexicErrors.length; n++){
				if(n == 0) errorString = lexicErrors[n] + ", ";
				else{
					if(n < lexicErrors.length - 1) errorString = errorString + lexicErrors[n] + ", ";
					else errorString = errorString + lexicErrors[n];
				}
			}
			alert("Errores lexicos en los caracteres: " + errorString);
		}
		this.top = 0;
		this.getToken();
		this.returnToken();
		this.getToken();
		this.getToken();
	}

	public setLexems(j: number, indexStart: number, indexEnd: number, input: string, state){
		if(state.getToken() != undefined){
			this.lexems[j] = [
				input.substring(indexStart, indexEnd),
				state.getToken()
			]; //Se guarda el caracter y el token
			console.log("Se recibio un token [" + this.state.getToken() + "]");
		}
	}

}

export { LexicAnalyzer };
