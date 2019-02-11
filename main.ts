import { Automaton } from "./ts/Automaton/Automaton";

// Arreglo de autómatas creados localmente.
const automata: Automaton[] = [];
(<HTMLElement>document.querySelector("#tools")).style.display = "none";
(<HTMLElement>document.querySelector("#target")).style.display = "none";

// Listener para crear autómatas simples
document.querySelector(".btn-creator").addEventListener("click", () => {
	const name_element = <HTMLInputElement>document.querySelector("#name");
	const symbol_element = <HTMLInputElement>document.querySelector("#symbol");
	const name = name_element.value;
	if (name.length === 0) {
		alert("Debe ingresar un nombre para el autómata.");
		return;
	} else if (automata.find(automaton => automaton.getName() === name)) {
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

// Listeners para controlar comportamiento de sección "target".
document.querySelector("#operation").addEventListener("change", event => {
	const operation = (<HTMLSelectElement>event.target).value;
	if (operation === "unirAFN" || operation === "concatenarAFN") {
		(<HTMLElement>document.querySelector("#target")).style.display =
			"inline-block";
		(<HTMLButtonElement>(
			document.querySelector(".btn-execute__one")
		)).style.display = "none";
	} else {
		(<HTMLElement>document.querySelector("#target")).style.display = "none";
		(<HTMLButtonElement>(
			document.querySelector(".btn-execute__one")
		)).style.display = "initial";
	}
});

// Listeners para realizar las operaciones unarias.
document.querySelector(".btn-execute__one").addEventListener("click", () => {
	const operation = (<HTMLSelectElement>document.querySelector("#operation"))
		.value;
	const automaton = automata.find(a => {
		const name = (<HTMLSelectElement>document.querySelector("#automaton"))
			.value;
		return a.getName() === name;
	});

	automaton[operation]();
	document.querySelector(
		"#automaton-table"
	).innerHTML = automaton.toHTMLTable();
});

// Listeners para realizar las operaciones binarias.
document.querySelector(".btn-execute__two").addEventListener("click", () => {
	const operation = (<HTMLSelectElement>document.querySelector("#operation"))
		.value;
	const a1 = automata.find(a => {
		const name = (<HTMLSelectElement>document.querySelector("#automaton"))
			.value;
		return a.getName() === name;
	});
	const a2 = automata.find(a => {
		const name = (<HTMLSelectElement>(
			document.querySelector("#target-automaton")
		)).value;
		return a.getName() === name;
	});

	if (a1.getName() === a2.getName()) {
		a1[operation](a1.copy());
	} else {
		a1[operation](a2);
	}
	document.querySelector("#automaton-table").innerHTML = a1.toHTMLTable();
});
