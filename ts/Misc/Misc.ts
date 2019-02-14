import { Automaton } from "../Automaton/Automaton";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import { Queue } from "../Queue/Queue";

namespace Misc {
	export const EPSILON: string = "\u03B5";

	/**
	 * Función Ir_a(). Aplica la función Mover() con los parámetros
	 * "states" que es un conjunto de estados y "symbol" que es un
	 * símbolo. Al resultado se le
	 *
	 *
	 * @param {Set<State>} states
	 * @param {string} symbol
	 * @returns {Set<State>}
	 */
	export const goTo = (states: Set<State>, symbol: string) => {
		let S: Set<State>;
		S = epsilonClosure(move(states, symbol));
		return S;
	};

	/**
	 * Función Mover(). Obtiene el conjunto de estados al que se
	 * puede acceder desde otro conjunto de estados "states"
	 * estrictamente mediante transiciones con un símbolo "symbol"
	 * dado.
	 *
	 * @param {Set<State>} setOfStates
	 * @param {string} symbol
	 * @returns {Set<State>}
	 */
	export const move = (states: Set<State>, symbol: string) => {
		const result = [...states].map(state => simpleMove(state, symbol));
		return result.reduce((union, set) => {
			set.forEach(state => {
				union.add(state);
			});
			return union;
		}, new Set<State>());
	};

	const simpleMove = (state: State, symbol: string) => {
		return new Set<State>(
			[...state.getTransitions().values()]
				.filter(transition => transition.getSymbol() === symbol)
				.map(transition => transition.getTargetState())
		);
	};

	/**
	 * Obtiene la cerradura épsilon de un conjunto de estados.
	 *
	 * @param {Set<State>} states
	 * @returns {Set<State>}
	 */
	export const epsilonClosure = (states: Set<State>) => {
		const epsilonSets = [...states].map(simpleEpsilonClosure);
		return epsilonSets.reduce((union, set) => {
			set.forEach(state => {
				union.add(state);
			});
			return union;
		}, new Set<State>());
	};

	/**
	 * Obtiene la cerradura épsilon de un estado.
	 *
	 * @param {State} state
	 * @returns {Set<State>}
	 */
	const simpleEpsilonClosure = (state: State) => {
		return new Set<State>(
			[...state.getTransitions().values()]
				.filter(transition => transition.getSymbol() === EPSILON)
				.map(transition => transition.getTargetState())
		);
    };
    

    /**
     *Realiza la conversion de AFN  a AFD
     * 
     * @param {Automaton} afn
     * @returns {Automaton} afd
     */

    export const afnToAfd = (afn: Automaton) => {
        let queue = new Queue<Set<State>>();
        let afd = new Automaton("afd");
        let estadoInicial = new State(0);
        let resultado = new Set<State>();
        let estadoAProcesar = new Set<State>();
        let estados = new Set<Set<State>>(); //Es un conjunto de conjuntos de estados
        let estadosAFD = new Set<State>(); //Contendra estados numerados de 0 a n
        let transicion : Transition;
        let state: State;
        afd.sigma = afn.getSigma(); //Se copia el alfabeto del AFN al AFD
        afd.sigma.delete(EPSILON); //Elimina Epsilon del alfabeto del AFD
        resultado = simpleEpsilonClosure(afn.startState); //Se calcula la cerradura epsilon del estado inicial y se guarda en resultado
        //queue.queue(resultado);
        afd.states.add(estadoInicial); //Agrega el inicial
        afd.startState = estadoInicial;
        while(!queue.isEmpty()){    
            estadoAProcesar = queue.dequeue();
            estados.add(estadoAProcesar); //Se agrega al subconjunto de estados al conjunto estados
            for(let i = 0; i < (afn.sigma.size - 1); i++){ //Se itera sobre los simbolos del alfabeto
                resultado = goTo(estadoAProcesar, afn.sigma[i]);
                for(let j = 0; j < estados.size; j++){ //Itera sobre los subconjuntos de estados en el conjunto estados
                    state = new State(estadosAFD.size);
                    afd.states.add(state);
                    if(resultado !== estados[j]){ //Si no exisitia este subconjunto de estados va a conformar un nuevo estado del AFD con su transicion
                        transicion = new Transition(
                            afn.sigma[i],
                            state,
                        );
                        for(let k = 0; k < estadoAProcesar.size; k++){
                            if(estadoAProcesar[k] === [...afn.acceptStates]){ //Si ese set contenia al menos un estado de aceptacion
                                afd.acceptStates.add(state); //se establece state como estado de aceptacion del AFD
                            };
                        }
                        afd.startState.addTransition(transicion);
                        queue.queue(resultado); //Si el estado no existia previamente en los estados ya asignados al AFD lo encola 
                    }
                    else{
                        transicion = new Transition(
                            afn.sigma[i],
                            afd.states[j]
                        );
                        state.addTransition(transicion); //Agrega una transicion al estado j del AFD
                    }
                }
            }
        }
    }

	export /**
	 *
	 *
	 * @param {string} symbol
	 * @param {string} limitSymbol
	 * @returns
	 */
	const getSymbolsFromRange = (symbol: string, limitSymbol: string) => {
		if (symbol.length !== 1 || limitSymbol.length !== 1) {
			return null;
		}
		const begin = symbol.charCodeAt(0);
		const end = limitSymbol.charCodeAt(0);
		const symbols: string[] = [];
		for (let ascii = begin; ascii <= end; ascii++) {
			symbols.push(String.fromCharCode(ascii));
		}
		return symbols;
	};

	/**
	 * Para el análisis léxico, tomamos el último estado de aceptación
	 * con el que se obtuvo un token y se guarda el índice hasta que, con
	 * caracteres siguientes, no se pueda hacer otra transición.
	 *
	 * En ese momento, se corta la cadena hasta el índice con el que se tuvo el
	 * último token y se empieza el proceso de nuevo.
	 *
	 *
	 * LIBRO: Compiler design in C.
	 */
}

export default Misc;
