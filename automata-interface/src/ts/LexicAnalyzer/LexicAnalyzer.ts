import { Automaton } from "../Automaton/Automaton";
import Misc from "../Misc/Misc";
import { State } from "../State/State";

class LexicAnalyzer {
    // Atributos fijos del analizador.
    private automaton: Automaton;
    private input: string;

    // Atributos de estado.
    private i: number;
    public lastLexemIndex: number;
    private indexStack: number[];

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
        let currentState: State = this.automaton.startState;
        let lastAcceptState: State = null;

        if (this.indexStack.length === 0) {
            this.indexStack.push(0);
        }

        this.i = this.indexStack[this.indexStack.length - 1];

        if (this.input[this.i] === Misc.EOI) {
            this.indexStack.push(this.i);
            return 0;
        }

        while (this.input[this.i] !== Misc.EOI) {
            if (
                currentState.getTransitionsBySymbol(this.input[this.i]).length >
                0
            ) {
                currentState = currentState
                    .getTransitionsBySymbol(this.input[this.i])[0]
                    .getTargetState();
                this.i++;
                if (this.automaton.acceptStates.has(currentState)) {
                    this.lastLexemIndex = this.i;
                    lastAcceptState = currentState;
                }
            } else {
                if (lastAcceptState === null) {
                    return -1;
                } else {
                    this.indexStack.push(this.lastLexemIndex);
                    return lastAcceptState.getToken();
                }
            }
        }

        this.indexStack.push(this.lastLexemIndex);
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

    public readonly getLexicState = () => {
        return {
            i: this.i,
            lastLexemIndex: this.lastLexemIndex,
            indexStack: [...this.indexStack]
        };
    };

    public readonly setLexicState = (lexicState: Object) => {
        for (let key in lexicState) {
            this[key] = lexicState[key];
        }
    };
}

export { LexicAnalyzer };
