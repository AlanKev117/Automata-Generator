import { ListenersHome } from "./ts/Listeners/ListenersHome";
import { ListenersLexic } from "./ts/Listeners/ListenersLexic";
import { Automaton } from "./ts/Automaton/Automaton";

// Arreglo de autómatas creados localmente.
const automata: Automaton[] = [];
(<HTMLDivElement>document.querySelector("#main__home")).style.display = "block";
(<HTMLDivElement>document.querySelector("#main__lexic")).style.display = "none";
// Ejecutamos los listeners de ListenersHome
// Asignamos acciones a los elementos de entrada.
ListenersHome.init();
ListenersHome.activateBtnCreator(automata);
ListenersHome.activateBtnExecuteOne(automata);
ListenersHome.activateBtnExecuteTwo(automata);
ListenersHome.activateAutomatonSelector(automata);
ListenersHome.makeTargetAutomatonSelectorDynamic(automata);
ListenersLexic.loadDFAs(automata);
// Listener para la opción de navegación a "lexic" (analizador sntáctico).
document.querySelector("#to-lexic").addEventListener("click", event => {
    event.preventDefault();
    const currentlyHere = window.location.href
        .split("/")
        .find(item => item === "lexic");
    if (!currentlyHere) {
        window.history.pushState(
            {},
            "/lexic",
            window.location.origin + "/lexic"
        );
        (<HTMLDivElement>document.querySelector("#main__lexic")).style.display =
            "initial";
        (<HTMLDivElement>document.querySelector("#main__home")).style.display =
            "none";
        (<HTMLAnchorElement>document.querySelector("#to-lexic")).classList.add(
            "active"
        );
    }
});

// Listener para la navegación a "home"
document.querySelector("#brand").addEventListener("click", event => {
    event.preventDefault();
    const currentlyHere = window.location.href
        .split("/")
        .find(item => item === "");
    if (!currentlyHere) {
        window.history.pushState({}, "/", window.location.origin);
        (<HTMLDivElement>document.querySelector("#main__home")).style.display =
            "block";
        (<HTMLDivElement>document.querySelector("#main__lexic")).style.display =
            "none";
    }
});
