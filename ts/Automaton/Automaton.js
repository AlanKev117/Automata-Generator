"use strict";
exports.__esModule = true;
var Automaton = /** @class */ (function () {
    function Automaton(sigma, startState, states, acceptStates) {
        this.sigma = sigma;
        this.startState = startState;
        this.states = states;
        this.acceptStates = acceptStates;
    }
    return Automaton;
}());
exports["default"] = Automaton;
