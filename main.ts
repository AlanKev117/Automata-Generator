import { Automaton } from "./ts/Automaton/Automaton";

// Arreglo de autómatas creados localmente.
const automata: Automaton[] = [];
(<HTMLElement>document.querySelector("#tools")).style.display = "none";
(<HTMLElement>document.querySelector("#target")).style.display = "none";

// Listener para crear autómatas simples
document.querySelector(".btn-creator").addEventListener("click", () => {
	const name = (<HTMLInputElement>document.querySelector("#name")).value;
	if (name.length === 0) {
		alert("Debe ingresar un nombre para el autómata.");
		return;
	} else if (automata.find(automaton => automaton.getName() === name)) {
		alert("Ingrese otro nombre para el autómata.");
		return;
	}
	const symbol = (<HTMLInputElement>document.querySelector("#symbol")).value;
	const symbols = symbol.split("-");
	console.log(symbols);
	switch (symbols.length) {
		case 1: {
			const automaton = new Automaton(name);
			automaton.createBasic(symbols[0]);
			automata.push(automaton);
			break;
		}

		case 2: {
			if (symbols.find(_symbol => _symbol.length !== 1)) {
				alert("El rango se da solamente con símbolos de longitud 1");
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

	const option = document.createElement("option");
	option.text = name;
	option.value = name;
	const automaton_select = document.querySelector("#automaton");
	automaton_select.appendChild(option);

	console.log(automata);
});

// Listeners para mostrar tabla de autómata según se seleccione.
document
	.querySelector("#automaton")
	.addEventListener("DOMNodeInserted", event => {
		const selector = <HTMLSelectElement>event.target;
		if (selector.childElementCount !== 0) {
			return;
		}
		document.querySelector("#automaton-table").innerHTML = automata
			.find(automaton => automaton.getName() === selector.value)
			.toHTMLTable();
		(<HTMLElement>document.querySelector("#tools")).style.display =
			"inline-block";
	});
document.querySelector("#automaton").addEventListener("change", event => {
	const name = (<HTMLSelectElement>event.target).value;
	document.querySelector("#automaton-table").innerHTML = automata
		.find(automaton => automaton.getName() === name)
		.toHTMLTable();
});

// Listeners para realizar las operaciones con algún autómata seleccionado.
document.querySelector("#operation").addEventListener("change", event => {
	
});