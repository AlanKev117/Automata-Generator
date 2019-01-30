import Automaton from "./ts/Automaton/Automaton";
import State from "./ts/State/State";

const states = [new State("A"), new State("B"), new State("C")];
const automaton = new Automaton(["a", "b"], states[0], states, [states[2]]);

document.getElementById("app").innerHTML = automaton.toString();