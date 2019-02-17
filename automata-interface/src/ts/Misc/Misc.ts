import { Automaton } from "../Automaton/Automaton";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";

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
            state
                .getTransitionsBySymbol(symbol)
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
     * Realiza la conversion de un AFN a un AFD
     *
     * @param {Automaton} afn
     * @returns {Automaton}
     */
    public static readonly afnToAfd = (afn: Automaton) => {
        const getSetWithKeysOfGiven = (
            superSet: Set<State>[],
            set: Set<State>
        ) => {
            const targetIDs = [...set]
                .map(state => "" + state.getId())
                .join(",");
            const found = [...superSet].find(s => {
                const currentIDs = [...s].map(s => "" + s.getId()).join(",");
                return currentIDs === targetIDs;
            });
            return found;
        };

        const afd = new Automaton(afn.getName());
        // Estado inicial del autómata AFD
        const s0: Set<State> = Misc.simpleEpsilonClosure(afn.getStartState());
        // Estados del autómata AFD
        const AFDMap: Set<State>[] = [s0];
        // Cola de análisis
        const queue: Set<State>[] = [s0];

        while (queue.length > 0) {
            const set = queue.shift();
            const index = AFDMap.indexOf(set);
            // Iteramos el alfabeto del AFN para agregar las
            afn.getSigma().forEach(symbol => {
                // Se obtiene Ir_A(Sn, symbol)
                const targetSet: Set<State> = Misc.goTo(set, symbol);
                let targetIndex: number;
                if (targetSet.size > 0) {
                    const actualTargetState = getSetWithKeysOfGiven(
                        AFDMap,
                        targetSet
                    );
                    if (!actualTargetState) {
                        targetIndex = AFDMap.length;
                        AFDMap.push(targetSet);
                        queue.push(targetSet);
                        //AFDSets.add(targetSet);
                    } else {
                        targetIndex = AFDMap.indexOf(actualTargetState);
                    }
                    afd.createTransition(index, symbol, null, targetIndex);
                }
            });
            // Si el conjunto set tiene algún estado de aceptación de afn,
            // se agrega al conjunto de estados de aceptación de afd.
            [...afn.getAcceptStates()].forEach(acceptState => {
                if (set.has(acceptState)) {
                    afd.getAcceptStates().add(
                        [...afd.getStates()].find(
                            state => state.getId() === index
                        )
                    );
                }
            });
        }

        // Atributos del nuevo autómata
        afd.startState = [...afd.states].find(state => state.getId() === 0);
        afd.sigma.delete(Misc.EPSILON); // Creo que esta no importa.
        console.log(afn.getName() + " hecho AFD");
        return afd;
    };

    /**
     *
     *
     * @param {string} symbol
     * @param {string} limitSymbol
     * @returns
     */
    public static readonly getSymbolsFromRange = (
        symbol: string,
        limitSymbol: string
    ) => {
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
