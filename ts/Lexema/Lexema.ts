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
	private token: any;
	
	constructor (caracteres:Set<string>,token:any){
		this.caracteres.clear();
		this.token = -1;
	}
	public readonly addCaracter = (c:string) => {
		this.caracteres = this.caracteres.add(c);
	}
	public readonly addTok = (t: string) => {
		this.token;
	}
    
}

