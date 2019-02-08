import {Automaton} from "./ts/Automaton/Automaton";
const automaton = new Automaton();
automaton.createBasic("a", "z");
automaton.makeKleene();
const containter = document.getElementById("automaton-table");
const str = automaton.toHTMLTable();
containter.innerHTML = str;