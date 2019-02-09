import { Automaton } from "./ts/Automaton/Automaton";

// Creamos autómatas vacíos.
const a1 = new Automaton();
const a2 = new Automaton();

// Aplicamos algunas operaciones a los autómatas.
a1.createBasic("a");
a2.createBasic("F");
a1.makeKleene();

// Los unimos en a1
a1.unirAFN(a2);

// Mostramos a1 en el DOM.
const containter = document.getElementById("automaton-table");
const str = a1.toHTMLTable();

containter.innerHTML = str;
