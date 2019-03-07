import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import { getCurves } from "crypto";

class LexicAnalyzer {
	private automaton: Automaton;
	private lexems: [string, number][];
	private acceptStatesSeen: Set<State>;
	private indexStart: number;
	private indexEnd: number;
	private transiciones: Transition[];
	private state: State;
	private input: string;
	private lexicErrors;
	private stack: [number, string][];
	private pointer;
	private errorFlag: boolean;
	private index: number;
	private enableFlag: boolean;
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
		this.lexicErrors = new Array();
		this.stack = new Array();
		this.pointer = 0;
		this.errorFlag = false;
		this.index = 0;
		this.enableFlag = false;
		this.top = 0;
	}

	getAutomaton = () => this.automaton;
	getLexems = () => this.lexems;
	getCurrentLexem = () => {
		/*
		if(this.stack.length > 0){
			let lexema: [number, string] = this.stack.pop();
			return lexema[1];
		}
		*/
		console.log("Se tiene el lexema: " + this.lexems[this.top - 1][0]);
		return this.lexems[this.top - 1][0];
	};

	/**
	 * Regresa un lexema dado a la pila de lexemas.
	 *
	 * @memberof LexicAnalyzer
	 */
	public returnToken = (token: number) => {
		//this.pointer--;
		/*
		this.enableFlag = true;
		let lexema = this.getCurrentLexem();
		this.stack.push([token, lexema]);
		console.log("Se regreso el token [" + token  + "] y el lexema [" + lexema + "]");
		*/
		if (this.top > 0) this.top--;
	else console.log("ERROR: Subdesbordamiento de pila");
	};


	public lexicAnalysis = (input: string) => {
		this.input = input;
		let t: number;
		t = this.getToken();
		let errorString: string;
		while(t != 0){
			console.log("Se recibio el token [ " + t + " ]");
			t = this.getToken();
		}
		if (!this.errorFlag) alert("CADENA ACEPTADA");
		else {
			for (let n = 0; n < this.lexicErrors.length; n++) {
				if (n == 0) errorString = this.lexicErrors[n] + ", ";
				else {
					if (n < this.lexicErrors.length - 1)
						errorString = errorString + this.lexicErrors[n] + ", ";
					else errorString = errorString + this.lexicErrors[n];
				}
			}
			alert("Errores lexicos en los caracteres: " + errorString);
		}
	}

	public GetToken = () => {
		if (this.top < this.lexems.length) {
			return this.lexems[this.top++][1];
		} 
		else if (this.top === this.lexems.length) {
			return undefined;
};
	}

	public getToken = () => {
		this.state = this.automaton.startState;
		this.acceptStatesSeen.clear();
		this.transiciones = [];
		let lexem: string;
		let resultado, tok: [number, string];
		if(this.enableFlag){
			tok = this.stack.pop();
			this.enableFlag = false;
			return tok[0];
		}
		if(this.pointer > this.input.length){
			//console.log("Final de cadena");
			return 0;
		}
		while(this.pointer < this.input.length){
			if (this.state.getTransitionsBySymbol(this.input[this.pointer]).length > 0) {
				this.transiciones = this.state.getTransitionsBySymbol(this.input[this.pointer]);
				this.state = [...this.transiciones][0].getTargetState(); //Se asume que solo se tuvo una transicion
				this.pointer++;
				if ([...this.automaton.acceptStates].includes(this.state)) {
					this.acceptStatesSeen.add(this.state);
					this.indexEnd = this.pointer;
				}
			} 
			else {
				if (this.acceptStatesSeen.size === 0) {
					console.log("ERROR léxico en " + this.pointer);
					this.lexicErrors.push(this.pointer);
					this.errorFlag = true;
					this.indexEnd--;
					this.indexStart++;
					this.pointer++;
					return -1;
				} else {
					lexem = "";
					lexem = this.input.substring(this.indexStart, this.indexEnd);
					//console.log("Se conformo el lexema: " + lexem);
					this.setLexems(lexem, this.state);
					resultado = this.state.getToken();
					this.indexStart = this.indexEnd;
					this.state = this.automaton.startState;
					this.acceptStatesSeen.clear();
					return resultado;	
				}
			}			
		}
		if (this.pointer == this.input.length){
			//console.log("Ultimo lexema");
			lexem = this.input.substring(this.indexStart, this.indexEnd);
			this.setLexems(lexem, this.state);
			resultado = this.state.getToken();
			this.pointer++;
			return resultado;
		}
	}

	public setLexems = (lexem: string, state: State) =>{
		let token = state.getToken();
		this.stack.push([token, lexem]);
		this.lexems[this.index] = [lexem, token];
		this.index++;
	}
}

export { LexicAnalyzer };
