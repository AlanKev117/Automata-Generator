import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";

namespace ListenersHome {
	// Inicializador para el DOM
	// Desactivamos las secciones que no se deben visualizar.
	export const init = 
	() => {
		(<HTMLElement>document.querySelector("#tools")).style.display = "none";
		(<HTMLElement>document.querySelector("#target")).style.display = "none";
		(<HTMLElement>document.querySelector("#main__lexic")).style.display =
			"none";
	};
	// Listener para crear autómatas simples
	export const activateBtnCreator = (automata: Automaton[]) => {
		document.querySelector(".btn-creator").addEventListener("click", () => {
			const name_element = <HTMLInputElement>(
				document.querySelector("#name")
			);
			const symbol_element = <HTMLInputElement>(
				document.querySelector("#symbol")
			);
			const name = name_element.value;
			if (name.length === 0) {
				alert("Debe ingresar un nombre para el autómata.");
				return;
			} else if (
				automata.find(automaton => automaton.getName() === name)
			) {
				alert("Ingrese otro nombre para el autómata.");
				return;
			}
			const symbol = symbol_element.value;
			const symbols = symbol.split("-");
			switch (symbols.length) {
				case 1: {
					const automaton = new Automaton(name);
					automaton.createBasic(symbols[0]);
					automata.push(automaton);
					//console.log(Misc.goTo(automaton.getStates(), "a"));
					break;
				}

				case 2: {
					if (symbols.find(_symbol => _symbol.length !== 1)) {
						alert(
							"El rango se da solamente con símbolos de longitud 1"
						);
						return;
					}
					const automaton = new Automaton(name);
					automaton.createBasic(symbols[0], symbols[1]);
					automata.push(automaton);
					break;
				}

				default: {
					alert("Inserte un símbolo o rango adecuado.");
					return;
				}
			}

			const option_one = document.createElement("option");
			option_one.text = name;
			option_one.value = name;
			const option_two = document.createElement("option");
			option_two.text = name;
			option_two.value = name;
			const automaton_select = <HTMLSelectElement>(
				document.querySelector("#automaton")
			);
			const target_select = <HTMLSelectElement>(
				document.querySelector("#target-automaton")
			);
			automaton_select.appendChild(option_one);
			automaton_select.value = name;
			target_select.appendChild(option_two);
			name_element.value = "";
			symbol_element.value = "";
		});
	};

	// Listeners para mostrar tabla de autómata según se seleccione.
	export const activateAutomatonSelector = (automata: Automaton[]) => {
		document
			.querySelector("#automaton")
			.addEventListener("DOMNodeInserted", event => {
				const selector = <HTMLSelectElement>event.target;
				if (selector.childElementCount !== 0) {
					return;
				}
				document.querySelector(
					"#automaton-table"
				).innerHTML = automata
					.find(automaton => automaton.getName() === selector.value)
					.toHTMLTable();
				(<HTMLElement>document.querySelector("#tools")).style.display =
					"inline-block";
			});
		document
			.querySelector("#automaton")
			.addEventListener("change", event => {
				const name = (<HTMLSelectElement>event.target).value;
				document.querySelector(
					"#automaton-table"
				).innerHTML = automata
					.find(automaton => automaton.getName() === name)
					.toHTMLTable();
			});
	};

	// Listeners para controlar comportamiento de sección "target".
	export const makeTargetAutomatonSelectorDynamic = (
		automata: Automaton[]
	) => {
		document
			.querySelector("#operation")
			.addEventListener("change", event => {
				const operation = (<HTMLSelectElement>event.target).value;
				if (operation === "unirAFN" || operation === "concatenarAFN") {
					(<HTMLElement>(
						document.querySelector("#target")
					)).style.display = "inline-block";
					(<HTMLButtonElement>(
						document.querySelector(".btn-execute__one")
					)).style.display = "none";
				} else {
					(<HTMLElement>(
						document.querySelector("#target")
					)).style.display = "none";
					(<HTMLButtonElement>(
						document.querySelector(".btn-execute__one")
					)).style.display = "initial";
				}
			});
	};

	// Listeners para realizar las operaciones unarias.
	export const activateBtnExecuteOne = (automata: Automaton[]) => {
		document
			.querySelector(".btn-execute__one")
			.addEventListener("click", () => {
				// Obtenemos el valor del selector.
				const operation = (<HTMLSelectElement>(
					document.querySelector("#operation")
				)).value;

				// Buscamos el autómata.
				let automaton = automata.find(a => {
					const name = (<HTMLSelectElement>(
						document.querySelector("#automaton")
					)).value;
					return a.getName() === name;
				});
				// Ejecutamos la operación según el valor del selector.
				if (operation === "hacerAFD") {
					automaton = Misc.afnToAfd(automaton.copy());
				} else {
					automaton[operation]();
				}
				// Mostramos al autómata en tabla.
				document.querySelector(
					"#automaton-table"
				).innerHTML = automaton.toHTMLTable();
			});
	};
	// Listeners para realizar las operaciones binarias.

	export const activateBtnExecuteTwo = (automata: Automaton[]) => {
		document
			.querySelector(".btn-execute__two")
			.addEventListener("click", () => {
				const operation = (<HTMLSelectElement>(
					document.querySelector("#operation")
				)).value;
				const a1 = automata.find(a => {
					const name = (<HTMLSelectElement>(
						document.querySelector("#automaton")
					)).value;
					return a.getName() === name;
				});
				const a2 = automata.find(a => {
					const name = (<HTMLSelectElement>(
						document.querySelector("#target-automaton")
					)).value;
					return a.getName() === name;
				});

				const copy: Automaton = a2.copy();
				a1[operation](copy);
				document.querySelector(
					"#automaton-table"
				).innerHTML = a1.toHTMLTable();
			});
	};

	export const close = () => {
		(<HTMLElement>document.querySelector("#main__home")).style.display =
			"none";
	};
}

export { ListenersHome };
