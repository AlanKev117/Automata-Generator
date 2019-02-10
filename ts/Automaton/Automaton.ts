import { State } from "../State/State";
import { Transition } from "../Transition/Transition";
import "../../css/table.css";

class Automaton {
	/**
	 * Nombre que se le asignará al autómata cuando se cree.
	 *
	 * @private
	 * @type {string}
	 * @memberof Automaton
	 */
	private name: string;

	/**
	 * Alfabeto del autómata.
	 *
	 * @private
	 * @type {Set<string>}
	 * @memberof Automaton
	 */
	private sigma: Set<string>;

	/**
	 * Conjunto de estados del autómata.
	 *
	 * @private
	 * @type {Set<State>}
	 * @memberof Automaton
	 */
	private states: Set<State>;

	/**
	 * Estado inicial del autómata.
	 *
	 * @private
	 * @type {State}
	 * @memberof Automaton
	 */
	private startState: State;

	/**
	 * Conjunto de estados de aceptación del autómata.
	 *
	 * @private
	 * @type {Set<State>}
	 * @memberof Automaton
	 */
	private acceptStates: Set<State>;

	/**
	 * Símbolo que actúa como la cadena vacía del autómata.
	 *
	 * @static
	 * @type {string}
	 * @memberof Automaton
	 */
	static readonly epsilon: string = "\u03B5";

	/**
	 * Genera un autómata vacío.
	 *
	 * @memberof Automaton
	 */
	constructor(name: string) {
		this.sigma = new Set<string>();
		this.sigma.clear();
		this.states = new Set<State>();
		this.states.clear();
		this.startState = null;
		this.acceptStates = new Set<State>();
		this.acceptStates.clear();
		this.name = name;
		alert(`Autómata ${name} creado exitosamente.`);
	}

	public readonly getName = () => {
		return this.name;
	};

	/**
	 * Crea un autómata básico de una transición con el símbolo symbol.
	 *
	 * @param {string} symbol {es el símbolo con el que se genera la transición}
	 * @param {string} [limitSymbol] {es un símbolo opcional que delimita el rango [symbol, limitSymbol]}
	 * @memberof Automaton
	 */
	public readonly createBasic = (symbol: string, limitSymbol?: string) => {
		let state0, state1;
		if (this.states.size == 0) {
			state0 = new State(0);
			state1 = new State(1);
		} else {
			state0 = new State(this.states.size);
			state1 = new State(this.states.size + 1);
		}
		const transition = new Transition(symbol, state1, limitSymbol);
		state0.addTransition(transition);

		// Se agregan los símbolos que abarca el rango (symbol, limitSymbol) a sigma.
		if (transition.hasLimitSymbol()) {
			for (
				let ascii = symbol.charCodeAt(0);
				ascii <= limitSymbol.charCodeAt(0);
				ascii++
			) {
				this.sigma.add(String.fromCharCode(ascii));
			}
		} else {
			this.sigma.add(symbol);
		}

		// Agregamos los estados a los conjuntos y establecemos estados inicial y finales.
		this.states.add(state0);
		this.states.add(state1);
		this.startState = state0;
		this.acceptStates.add(state1);
	};

	/**
	 * Une un autómata a otro conservando la integridad de las transiciones.
	 *
	 * @param {Automaton} automaton {es el automata que se va a unir con this}
	 * @memberof Automaton
	 */
	public readonly unirAFN = (automaton: Automaton) => {
		let stateIni = new State(this.states.size + automaton.states.size);
		let stateEnd = new State(this.states.size + automaton.states.size + 1);

		const finalTransition = new Transition(Automaton.epsilon, stateEnd);
		const initialTransitionAFN_1 = new Transition(
			Automaton.epsilon,
			this.startState
		);
		const initialTransitionAFN_2 = new Transition(
			Automaton.epsilon,
			automaton.startState
		);
		// Se agrega la transición final nueva a todos los estados finales del AFN this.
		[...this.states]
			.filter(state => this.acceptStates.has(state))
			.forEach(acceptState => {
				acceptState.addTransition(finalTransition);
			});
		// Se agrega la transición final nueva a todos los estados finales del AFN que recibimos como parametro.
		[...automaton.states]
			.filter(state => automaton.acceptStates.has(state))
			.forEach(acceptState => {
				acceptState.addTransition(finalTransition);
			});
		// Se limpia el conjunto de estados finales.
		this.acceptStates.clear();
		// Y se reemplaza solo por el nuevo estado final.
		this.acceptStates.add(stateEnd);

		//Se agregan los estados del AFN2 al AFN1
		for (let i = 0; i < automaton.states.size; i++) {
			this.states.add([...automaton.states][i]);
		}
		//Se agregan los simbolos del AFN2 al AFN1
		for (let i = 0; i < automaton.sigma.size; i++) {
			this.sigma.add([...automaton.sigma][i]);
		}
		// Se agregan los estados nuevos al conjunto de estados.
		this.states.add(stateIni);
		this.states.add(stateEnd);
		//Se reordenan los id para evitar duplicidades
		for (let i = 0; i < this.states.size; i++) {
			[...this.states][i].id = i; // "0", "1", "2", ... "n"
		}
		// Se reemplaza el nuevo estado inicial.
		this.startState = stateIni;
		// Se le agregan las transiciones al inicio antiguo del autómata y al final del mismo.
		this.startState.addTransition(initialTransitionAFN_1);
		this.startState.addTransition(initialTransitionAFN_2);
		// Se agregan los símbolos que abarca el rango (symbol, limitSymbol) a sigma.
	};


	public readonly concatenarAFN = (automaton:Automaton) => {
		//le asignamos el nuevo nombre a nuestro automata
		this.name = (this.name + " ° " + automaton.name);
		let stateEnd = new State(this.states.size + automaton.states.size + 1);

		const initialTransition = new Transition(Automaton.epsilon, automaton.startState);

		//automaton tiene un estado inicial el cual vamos a unir con los estados finales de this
		//mediante epsilon y se borra el estado de aceptacio
		[...this.states]
		.filter(state => this.acceptStates.has(state))
		.forEach(acceptState => {
			acceptState.addTransition(initialTransition);
		});
		//se limpia el conjunto de estados finales de this
		this.acceptStates.clear();

		//Se agregan los estados del AFN2 al AFN1--
		for (let i = 0; i < automaton.states.size; i++) {
			this.states.add([...automaton.states][i]);
		}
		//Se agregan los simbolos del AFN2 al AFN1---
		for (let i = 0; i < automaton.sigma.size; i++) {
			this.sigma.add([...automaton.sigma][i]);
		}

		//Se reordenan los id para evitar duplicidades---
		for (let i = 0; i < this.states.size; i++) {
			[...this.states][i].id = i; // "0", "1", "2", ... "n"
		}
	};
	


	/**
	 * Crea la cerradura opcional del autómata.
	 *
	 * @memberof Automaton
	 */
	public readonly makeOptional = () => {
		// Se crea el estado inicial auxiliar.
		const nextBeginState = new State(this.states.size);
		// Se crea el estado final auxiliar.
		const nextFinalState = new State(this.states.size + 1);
		// Se crea transición épsilon que va al estado final.
		const finalTransition = new Transition(
			Automaton.epsilon,
			nextFinalState
		);
		// Se crea transición épsilon que partirá del nuevo estado inicial.
		const firstTransition = new Transition(
			Automaton.epsilon,
			this.startState
		);
		// Se agrega la transición final nueva a todos los estados finales.
		[...this.states]
			.filter(state => this.acceptStates.has(state))
			.forEach(acceptState => {
				acceptState.addTransition(finalTransition);
			});
		// Se limpia el conjunto de estados finales.
		this.acceptStates.clear();
		// Y se reemplaza solo por el nuevo estado final.
		this.acceptStates.add(nextFinalState);
		// Se agregan los estados nuevos al conjunto de estados.
		this.states.add(nextBeginState);
		this.states.add(nextFinalState);
		// Se reemplaza el nuevo estado inicial.
		this.startState = nextBeginState;
		// Se le agregan las transiciones al inicio antiguo del autómata y al final del mismo.
		this.startState.addTransition(firstTransition);
		this.startState.addTransition(finalTransition);
	};

	/**
	 * Crea la cerradura positiva del autómata.
	 *
	 * @memberof Automaton
	 */
	public readonly makePositive = () => {
		// Nos aseguramos de que solo haya un estado final.
		if (this.acceptStates.size != 1) {
			console.log("El autómata no tiene un único estado final.");
			return;
		}

		// Se crea el estado inicial auxiliar.
		const nextBeginState = new State(this.states.size);
		// Se crea el estado final auxiliar.
		const nextFinalState = new State(this.states.size + 1);
		// Se crea transición épsilon que va al estado final.
		const finalTransition = new Transition(
			Automaton.epsilon,
			nextFinalState
		);
		// Se crea transición épsilon que va hacia el viejo estado inicial.
		const toPrevStartTransition = new Transition(
			Automaton.epsilon,
			this.startState
		);

		// Agregamos transiciones a los respectivos estados.
		/* const prevFinalState = [...this.states].filter(state =>
			this.acceptStates.has(state)
		)[0];*/
		const prevFinalState = [...this.acceptStates][0];
		prevFinalState.addTransition(toPrevStartTransition);
		prevFinalState.addTransition(finalTransition);

		nextBeginState.addTransition(toPrevStartTransition);
		this.acceptStates.clear();
		this.acceptStates.add(nextFinalState);
		this.startState = nextBeginState;
		this.states.add(nextBeginState);
		this.states.add(nextFinalState);
	};

	/**
	 * Crea la cerradura de Kleene del autómata.
	 *
	 * @memberof Automaton
	 */
	public readonly makeKleene = () => {
		// Se hace la cerradura positiva del autómata
		this.makePositive();
		const transitionToEnd = new Transition(
			Automaton.epsilon,
			[...this.acceptStates][0]
		);
		// Se agrega la transición épsilon del inicio al fin del autómata.
		this.startState.addTransition(transitionToEnd);
	};

	/**
	 * Obtiene un estado mediante el identificador suministrado. Se puede indicar si es un estado terminal.
	 *
	 * @private
	 * @param {number} id {identificador del estado en this.states}
	 * @param {boolean} [final] {bandera que indica si pertenece a this.acceptStates}
	 * @returns {State} {estado que coincide con la consulta}
	 * @memberof Automaton
	 */
	public readonly getState = (id: number, final?: boolean) => {
		if (final) {
			return [...this.acceptStates].filter(state => state.id === id)[0];
		}
		return [...this.states].filter(state => state.id === id)[0];
	};

	public readonly toHTMLTable = () => {
		const tmpSigma = new Set<string>([...this.sigma, Automaton.epsilon]);
		// Encabezado de la tabla.
		const head =
			"<tr>" +
			[...tmpSigma].reduce(
				(tableHead, symbol) => tableHead + `<th>${symbol}</th>`,
				"<th>Estado</th>"
			) +
			"</tr>";
		// Cuerpo (filas) de la tabla.
		const body = [...this.states]
			.map(state => {
				// Celda del estado actual.
				let stateCell: string;
				if (this.startState === state) {
					stateCell = `<td class="state-cell start"><p>${
						state.id
					}</p></td>`;
				} else if (this.acceptStates.has(state)) {
					stateCell = `<td class="state-cell accept"><p>${
						state.id
					}</p></td>`;
				} else {
					stateCell = `<td class="state-cell"><p>${
						state.id
					}</p></td>`;
				}
				// Resto de la fila.
				let targetStatesRow: string = "";
				for (let symbol of tmpSigma) {
					const targetStates = state
						.getTransitionsBySymbol(symbol)
						.map(transition => `${transition.targetState.id}`)
						.join(", ");
					const cell = `<td>{${
						targetStates.length > 0 ? targetStates : " "
					}}</td>`;
					targetStatesRow += cell;
				}
				//Fila completa.
				return `<tr>${stateCell}${targetStatesRow}</tr>`;
			})
			// Se unen (concatenan) todas las filas
			.join("");
		return `<table>${head}${body}</table>`;
	};
}

export { Automaton };
