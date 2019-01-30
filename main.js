"use strict";
exports.__esModule = true;
var Automaton_1 = require("./ts/Automaton/Automaton");
var State_1 = require("./ts/State/State");
var states = [new State_1["default"]("A"), new State_1["default"]("B"), new State_1["default"]("C")];
var automaton = new Automaton_1["default"](["a", "b"], states[0], states, [states[2]]);
