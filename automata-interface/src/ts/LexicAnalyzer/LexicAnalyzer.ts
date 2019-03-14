import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";
import { Transition } from "../Transition/Transition";

class LexicAnalyzer {
    private automaton: Automaton;
    private indexStack: number[];
    private input: string;

    constructor(
        automata: Automaton[],
        tokens: Object,
        lexicName: string,
        input: string
    ) {
        const copies = automata.map(auto => auto.copy());
        copies.forEach(auto => {
            auto.setToken(tokens[auto.getName()]);
        });

        // Inicialización para el algoritmo.
        this.automaton = Misc.afnToAfd(Misc.unirAFNAnalisis(copies, lexicName));
        this.input = input + Misc.EOI;
        this.indexStack = [];
    }

    getAutomaton = () => this.automaton;

    reset = (input: string) => {
        this.indexStack = [];
        this.input = input;
    };

    setInput = (input: string) => {
        this.input = input;
    };

    public readonly getToken = () => {
        let i: number;
        let lastLexemIndex: number;
        let currentState: State = this.automaton.startState;
        let lastAcceptState: State = null;

        if (this.indexStack.length === 0) {
            this.indexStack.push(0);
        }

        i = this.indexStack[this.indexStack.length - 1];

        if (this.input[i] === Misc.EOI) {
            this.indexStack.push(i);
            return 0;
        }

        while (this.input[i] !== Misc.EOI) {
            if (currentState.getTransitionsBySymbol(this.input[i]).length > 0) {
                currentState = currentState
                    .getTransitionsBySymbol(this.input[i])[0]
                    .getTargetState();
                i++;
                if (this.automaton.acceptStates.has(currentState)) {
                    lastLexemIndex = i;
                    lastAcceptState = currentState;
                }
            } else {
                if (lastAcceptState === null) {
                    return -1;
                } else {
                    this.indexStack.push(lastLexemIndex);
                    return lastAcceptState.getToken();
                }
            }
        }

        this.indexStack.push(lastLexemIndex);
        return lastAcceptState.getToken();
    };

    public readonly returnToken = () => {
        if (this.indexStack.length > 0) {
            this.indexStack.pop();
        }
    };

    public readonly getCurrentLexem = () => {
        if (this.indexStack.length >= 2) {
            const firstIndex = this.indexStack[this.indexStack.length - 2];
            const secondIndex = this.indexStack[this.indexStack.length - 1];
            return this.input.substring(firstIndex, secondIndex);
        } else {
            return null;
        }
    };
}

export { LexicAnalyzer };
