import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import Misc from "../Misc/Misc";
import  {Automaton} from "../Automaton/Automaton";


class lexema{
    	/**
	 * Guarda los caracteres dentro del sigma.
	 *
	 * @param caracteres {Conjunto de caracteres del Lenguaje}
	 */
    private caracteres: Set<string>;

        	/**
	 * Guarda los caracteres dentro del sigma.
	 *
	 * @param token {Token correspondiente al AFN}
	 */
	private token: string;
	
	constructor (caracteres:Set<string>,token:string){
		this.caracteres = caracteres;
		this.token = token;
	}
	public readonly addCaracter = (c:Set<string>) => {
		this.caracteres = c;
	}
	public readonly addTok = (t: string) => {
		this.token;
	}
    
}

