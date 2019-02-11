import Automaton from "./ts/Automaton/Automaton";
const automaton = new Automaton();
const automaton2 = new Automaton();
automaton.createBasic("a", "z");
automaton.makeKleene();
automaton2.createBasic("1", "8");
automaton.unirAFN(automaton2);
const containter = document.getElementById("automaton-table");
const str = automaton.toHTMLTable();

containter.innerHTML = str;

