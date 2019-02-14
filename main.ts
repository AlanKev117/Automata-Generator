import { ListenersHome } from "./ts/Listeners/ListenersHome";
import { Automaton } from "./ts/Automaton/Automaton";

// Arreglo de autómatas creados localmente.
const automata: Automaton[] = [];

// Listener para la opción de navegación a "syntax" (analizador sntáctico).
document.querySelector("#to-syntax").addEventListener("click", event => {
	event.preventDefault();
	const currentlyHere = window.location.href
		.split("/")
		.find(item => item === "syntax");
	if (!currentlyHere) {
		window.history.pushState(
			{},
			"/syntax",
			window.location.origin + "/syntax"
		);
		(<HTMLDivElement>document.querySelector("#main__home")).style.display = "none";
		(<HTMLDivElement>document.querySelector("#main__syntax")).style.display = "block";
		(<HTMLAnchorElement>document.querySelector("#to-syntax")).classList.add("active");
	}
	
});

// Listener para la navegación a "home"
document.querySelector("#brand").addEventListener("click", event => {
	event.preventDefault();
	const currentlyHere = window.location.href
		.split("/")
		.find(item => item === "");
	if (!currentlyHere) {
		window.history.pushState(
			{},
			"/",
			window.location.origin
		);
		(<HTMLDivElement>document.querySelector("#main__home")).style.display = "block";
		(<HTMLDivElement>document.querySelector("#main__syntax")).style.display = "none";
		(<HTMLAnchorElement>document.querySelector("#to-syntax")).classList.remove("active");
	}
});

// Ejecutamos los listeners de ListenersHome
// Asignamos acciones a los elementos de entrada.
ListenersHome.init();
ListenersHome.activateBtnCreator(automata);
ListenersHome.activateBtnExecuteOne(automata);
ListenersHome.activateBtnExecuteTwo(automata);
ListenersHome.activateAutomatonSelector(automata);
ListenersHome.makeTargetAutomatonSelectorDynamic(automata);
