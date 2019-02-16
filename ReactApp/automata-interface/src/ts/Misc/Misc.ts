import { Automaton } from "../Automaton/Automaton";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import { Queue } from "../Queue/Queue";

class Misc {
    public static readonly EPSILON: string = "\u03B5";

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
    public static readonly goTo = (states: Set<State>, symbol: string) => {
        return Misc.epsilonClosure(Misc.move(states, symbol));
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
    public static readonly move = (states: Set<State>, symbol: string) => {
        const result = [...states].map(state => Misc.simpleMove(state, symbol));
        return result.reduce((union, set) => {
            set.forEach(state => {
                union.add(state);
            });
            return union;
        }, new Set<State>());
    };

    public static readonly simpleMove = (state: State, symbol: string) => {
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
    public static readonly epsilonClosure = (states: Set<State>) => {
        const epsilonSets = [...states].map(state =>
            Misc.simpleEpsilonClosure(state)
        );
        return epsilonSets.reduce((union, set) => {
            set.forEach(state => {
                union.add(state);
            });
            return union;
        }, new Set<State>());
    };

    /**
     * Obtiene la cerradura épsilon de un estado a un nivel.
     *
     * @param {State} state
     * @returns {Set<State>}
     */
    public static readonly simpleEpsilonClosure = (state: State) => {
        // Función auxiliar.
        const epsilonChildren = (s: State) => {
            return [...s.getTransitions()]
                .filter(transition => transition.getSymbol() === Misc.EPSILON)
                .map(transition => transition.getTargetState());
        };
        // Agregamos estados hasta que no se puedan agregar más.
        let previousSize: number;
        const epStates = new Set<State>();
        let children = [state];
        do {
            previousSize = epStates.size;
            children.forEach(child => {
                epStates.add(child);
            });
            children = children.reduce((union, current) => {
                const newChildren = epsilonChildren(current);
                newChildren.forEach(newChild => {
                    union.push(newChild);
                });
                return union;
            }, []);
        } while (previousSize !== epStates.size);

        return epStates;
    };

    /**
     *Realiza la conversion de AFN  a AFD
     *
     * @param {Automaton} afn
     * @returns {Automaton} afd
     */

    public static readonly afnToAfd = (afn: Automaton) => {
        // Estado inicial del autómata AFD
        const s0 = Misc.simpleEpsilonClosure(afn.getStartState());
        // Estados del autómata AFD
        const afdSets = new Set<Set<State>>([s0]);
        // Cola de análisis
        const queue = [s0];
        // Estado en análisis del AFD
		let currentSet: Set<State>;
		// Mapeo de estados con conjuntos de estados
		const stateSupplier = {};

        // Iteramos el alfabeto del AFN
        while (queue.length > 0) {
            currentSet = queue.shift();
			// Creamos un estado AFD asociado a "currentSet" si es que este no se encuentra
			// en el conjunto de conjuntos de estados del AFD.
            afn.getSigma().forEach(symbol => {
				const s_i = Misc.goTo(currentSet, symbol); // Se obtiene Ir_A(Sn, symbol)
                if (s_i.size > 0) {
					// const AFDOriginState = stateSupplier[]? 
                    // Agregamos el conjunto S[i] al final de la cola de análisis.
                    // const ADFTargetState = new State(afdSets.size);
                    // queue.push(s_i);
                    // const transition = new Transition(symbol, AFDTargetState);
                    // currentSet;
                }
            });
            currentSet = queue.shift();
        }
    };

    /**
     *
     *
     * @param {string} symbol
     * @param {string} limitSymbol
     * @returns
     */
    public static readonly getSymbolsFromRange = (symbol: string, limitSymbol: string) => {
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

    // const analizadorLexico = () =>{
    // 	//previously_seen_accepting = none_seen;
    // 	if(esUltimaEntrada(caracter_sig)){
    // 		return 0;
    // 	}
    // 	while (caracter_sig != finalEntrada){

    // 		if(estadoActual.haytrancicion(caracter_sig)){
    // 			estadoActual = estadoActual.transicion(caracter_sig);
    // 			if(estadoActual == acceptState){
    // 				posicionActual = pocicionEntrada
    // 			}else

    // 		}

    // 	}

    // }
}

export default Misc;
