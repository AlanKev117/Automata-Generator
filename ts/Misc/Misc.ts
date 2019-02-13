import { Automaton } from "../Automaton/Automaton";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";

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
