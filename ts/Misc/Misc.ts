import {Automaton} from "../Automaton/Automaton";
import {State} from "../State/State";
import {Transition} from "../Transition/Transition";

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
            [...state.transitions.values()]
                .filter(transition => transition.symbol === EPSILON)
                .map(transition => transition.targetState)
        );
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
