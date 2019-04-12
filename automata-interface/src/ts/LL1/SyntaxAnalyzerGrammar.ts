import { LexicAnalyzer } from "../LexicAnalyzer/LexicAnalyzer";
import { SyntaxAnalyzerRegex } from "../Regex/SyntaxAnalyzerRegex";
import { Node } from "./Node";
import { Gramatica } from "./Gramatica";
import { Automaton } from "../Automaton/Automaton";

enum Token {
    ARROW = 1,
    PIPE,
    SEMICOLON,
    SYMBOL
}

class SyntaxAnalyzerGrammar {
    private lexicAnalyzer: LexicAnalyzer;

    constructor(input: string) {
        const tokens = { ...Token };
        const automata = this.createAutomataForLexic();
        this.lexicAnalyzer = new LexicAnalyzer(
            automata,
            tokens,
            "Analizador de Gramáticas",
            input
        );
    }

    private readonly createAutomataForLexic = () => {
        const autoARROW: Automaton = new SyntaxAnalyzerRegex("\\-&>").solve(
            "ARROW"
        );
        const autoPIPE: Automaton = new SyntaxAnalyzerRegex("\\|").solve(
            "PIPE"
        );
        const autoSEMICOLON: Automaton = new SyntaxAnalyzerRegex(";").solve(
            "SEMICOLON"
        );
        const autoSYMBOL: Automaton = new SyntaxAnalyzerRegex(
            "[a-z]|[A-Z]|[0-9]|\\&"
        ).solve("SYMBOL");
        return [autoARROW, autoPIPE, autoSEMICOLON, autoSYMBOL];
    };

    public solve = (nameOfNewGrammar: string) => {
        const val: Node[] = [];
        if (this.G(val)) {
            const grammar = new Gramatica(nameOfNewGrammar);
            grammar.rules = val[0];
            grammar.setNonTerminals(val[0]);
            grammar.setTerminals(val[0]);
            grammar.startSymbol = val[0].symbol;
            return grammar;
        } else {
            alert("Error sintáctico");
            return null;
        }
    };

    /**
     * Función global de descenso recursivo.
     *
     * @memberof SyntaxAnalyzerGrammar
     */
    public readonly G = (node: Node[]) => {
        return this._LR_(node);
    };

    public readonly _LR_ = (node: Node[]) => {
        if (this._R_(node)) {
            if (this.lexicAnalyzer.getToken() === Token.SEMICOLON) {
                // Nuevo nodo para guardar una regla.
                let node1: Node[] = [];
                // Estado del analizador léxico antes de entrar a _LR_ de nuevo.
                let s: object = this.lexicAnalyzer.getLexicState();
                if (this._LR_(node1)) {
                    node[0].down = node1[0];
                    return true;
                }
                this.lexicAnalyzer.setLexicState(s);
                return true;
            }
            return false;
        }
    };

    public readonly _R_ = (node: Node[]) => {
        let token: number;
        if (this._LI_(node)) {
            token = this.lexicAnalyzer.getToken();
            if (token === Token.ARROW) {
                let node1: Node[] = [];
                if (this._LLD_(node1)) {
                    node[0].right = node1[0];
                    return true;
                }
            }
        }
        return false;
    };
    public readonly _LI_ = (node: Node[]) => {
        let token: number = this.lexicAnalyzer.getToken();
        if (token === Token.SYMBOL) {
            node[0] = new Node(this.lexicAnalyzer.getCurrentLexem());
            return true;
        }
        return false;
    };
    public readonly _LLD_ = (node: Node[]) => {
        let token: number;
        if (this._LD_(node)) {
            token = this.lexicAnalyzer.getToken();
            if (token === Token.PIPE) {
                if (this._LLD_(node)) {
                    return true;
                }
                return false;
            }
            this.lexicAnalyzer.returnToken();
            return true;
        }
        return false;
    };
    public readonly _LD_ = (node: Node[]) => {
        return this._LS_(node);
    };
    public readonly _LS_ = (node: Node[]) => {
        let token: number = this.lexicAnalyzer.getToken();
        if (token === Token.SYMBOL) {
            node[0] = new Node(this.lexicAnalyzer.getCurrentLexem());
            if (this._LS_(node)) {
                let s: object = this.lexicAnalyzer.getLexicState();
                let node1: Node[] = null;
                if (this._LS_(node1)) {
                    node[0].right = node1[0];
                    return true;
                }
                this.lexicAnalyzer.setLexicState(s);
            }
            return true;
        }
        this.lexicAnalyzer.returnToken();
        return false;
    };
}

export { SyntaxAnalyzerGrammar };
