import { Automaton } from "../Automaton/Automaton";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";

class Misc {
	public static readonly EPSILON: string = "\u03B5";
	public static readonly EOI: string = String.fromCharCode(0);
	public static readonly PESOS: string = "$";

	/**
	 * Función Ir_a(). Aplica la función Mover() con los parámetros
	 * "states" que es un conjunto de estados y "symbol" que es un
	 * símbolo. Al resultado se le
	 *
	 *
	 * @param {Set<State>} states
	 * @param {string} symbol
	 * @returns {Set<State>}
	 * @memberof Misc
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
	 * @memberof Misc
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
	 * @memberof Misc
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
	 * @memberof Misc
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
	 * Función auxiliar para encontrar un conjunto cuyas llaves sean las
	 * mismas de las de los estados contenidos dentro de otro dado
	 * (verificar si un conjunto de estados está en otro conjunto de
	 * conjuntos de estados).
	 *
	 * @static
	 * @param {Set<State>[]} sets
	 * @param {Set<State>} set
	 * @returns {Set<State>}
	 * @memberof Misc
	 */
	public static readonly findSet = (sets: Set<State>[], set: Set<State>) => {
		const targetIDs = [...set]
			.map(state => `${state.getId()}`)
			.sort()
			.join(",");
		const found = sets.find(s => {
			const currentIDs = [...s]
				.map(s => `${s.getId()}`)
				.sort()
				.join(",");
			return currentIDs === targetIDs;
		});
		return found;
	};

	/**
	 * Realiza la conversion de un AFN a un AFD
	 *
	 * @param {Automaton} afn
	 * @returns {Automaton}
	 */
	public static readonly afnToAfd = (afn: Automaton) => {
		// Autómata a regresar
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
					const actualTargetState = Misc.findSet(AFDMap, targetSet);
					if (!actualTargetState) {
						targetIndex = AFDMap.length;
						AFDMap.push(targetSet);
						queue.push(targetSet);
					} else {
						targetIndex = AFDMap.indexOf(actualTargetState);
					}
					afd.createTransition(index, symbol, null, targetIndex);
				}
			});
			// Si el conjunto set tiene algún estado de aceptación de afn,
			// se agrega al conjunto de estados de aceptación de afd.
			const AFDAcceptState = [...afd.getStates()].find(state => {
				return state.getId() === index;
			});
			[...afn.getAcceptStates()].forEach(acceptState => {
				if (set.has(acceptState)) {
					AFDAcceptState.setToken(acceptState.getToken());
					afd.getAcceptStates().add(AFDAcceptState);
				}
			});
		}

		// Atributos del nuevo autómata
		afd.startState = [...afd.states].find(state => state.getId() === 0);
		afd.sigma.delete(Misc.EPSILON); // Creo que esta no importa.
		return afd;
	};

	/**
	 * Concatena un automata con otro para analisis lexico (teniendo 2 o mas estados
	 * de aceptacion y conservandolos)
	 *
	 * @param {Automaton} automaton {es el automata que se va a unir con this}
	 * @memberof Automaton
	 */

	public static readonly unirAFNAnalisis = (
		automata: Automaton[],
		lexicName: string
	) => {
		let stateIni = new State(0);
		let newStates;
		let initialTransitionAFN: Transition = new Transition(
			Misc.EPSILON,
			automata[0].startState
		);
		// Se agregan los estados nuevos al conjunto de estados.
		automata[0].states.add(stateIni);
		stateIni.addTransition(initialTransitionAFN);
		// Se reemplaza el nuevo estado inicial.
		automata[0].startState = stateIni;
		//automata[0].startState.addTransition(initialTransitionAFN);
		for (let i = 1; i < automata.length; i++) {
			initialTransitionAFN = new Transition(
				Misc.EPSILON,
				automata[i].startState
			);
			newStates = [...automata[i].states];
			newStates.forEach(state => {
				automata[0].states.add(state);
			});
			[...automata[i].sigma].forEach(symbol => {
				automata[0].sigma.add(symbol);
			});
			[...automata[i].acceptStates].forEach(state => {
				automata[0].acceptStates.add(state);
			});
			// Se le agregan las transiciones al inicio del automata de analisis
			automata[0].startState.addTransition(initialTransitionAFN);
		}
		let flag: boolean = false;
		automata[0].startState.setId(0);
		newStates = [...automata[0].states];
		newStates.forEach((state, index) => {
			if (state != automata[0].startState && flag == false)
				state.setId(index + 1);
			else {
				if (flag == false) {
					state.setId(0);
					flag = true;
				} else state.setId(index);
			}
		});
		automata[0].setName(lexicName);
		return automata[0];
	};

	/**
	 * Obtiene un arreglo con caracteres cuyo valor ASCII se encuentra
	 * entre dos caracteres dados.
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

	public static readonly assertAFN = (automaton: Automaton) => {
		let res = true;
		automaton.getStates().forEach(state => {
			const symbols = new Set<string>();
			state.getTransitions().forEach(trans => {
				if (trans.hasLimitSymbol()) {
					Misc.getSymbolsFromRange(
						trans.getSymbol(),
						trans.getLimitSymbol()
					).forEach(symbol => {
						if (symbols.has(symbol)) {
							return (res = false);
						} else {
							symbols.add(symbol);
						}
					});
				} else {
					if (symbols.has(trans.getSymbol())) {
						return (res = false);
					} else {
						symbols.add(trans.getSymbol());
					}
				}
				symbols.clear();
			});
		});
		return res;
	};

	public static readonly assertEpsTransitions = (automaton: Automaton) => {
		let res = false;
		automaton.getStates().forEach(state => {
			state.getTransitions().forEach(trans => {
				if (!trans.hasLimitSymbol()) {
					if (trans.getSymbol() === Misc.EPSILON) {
						return res = true;
					}
				}
			});
		});
		return res;
	};
}

export default Misc;
