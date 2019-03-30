import { LexicAnalyzer } from "../LexicAnalyzer/LexicAnalyzer";
import { SyntaxAnalyzerRegex } from "../Regex/SyntaxAnalyzerRegex";
import { Node } from "./Node";
import Lexic from "../../containers/Pages/Lexic/Lexic";

enum Token {
    ARROW = 1,
    PIPE,
    SEMICOLON,
    SYMBOL
}

class SyntaxAnalyzerGrammar {
    private lexicAnalyzer: LexicAnalyzer;
    private input: string;

    constructor(input: string) {
        const tokens = { ...Token };
        const automata = this.createAutomataForLexic();
        // Inicializar...
    }

    private readonly createAutomataForLexic = () => {
        const autoARROW = new SyntaxAnalyzerRegex("-&>").solve("ARROW");
        const autoPIPE = new SyntaxAnalyzerRegex("|").solve("PIPE");
        const autoSEMICOLON = new SyntaxAnalyzerRegex(";").solve("SEMICOLON");
        const autoSYMBOL = new SyntaxAnalyzerRegex(
            "[a-z]|[A-Z]|[0-9]|\\&"
        ).solve("SYMBOL");
    };

    /**
     * Función global de descenso recursivo.
     *
     * @memberof SyntaxAnalyzerGrammar
     */
    public readonly G = (node: Node) => {
        return this._LR_(node);
    };

    public readonly _LR_ = (node: Node) => {
        if (this._R_(node)) {
            if (this.lexicAnalyzer.getToken() === Token.SEMICOLON) {
                // Nuevo nodo para guardar una regla.
                let node1: Node = null;
                // Estado del analizador léxico antes de entrar a _LR_ de nuevo.
                let s: object = this.lexicAnalyzer.getLexicState();
                if (this._LR_(node1)) {
                    node.down = node1;
                    return true;
                }
                this.lexicAnalyzer.setLexicState(s);
                return true;
            }
            return false;
        }
    };

    public readonly _R_ = (node: Node) => {
        let token: number;
        if (this._LI_(node)) {
            token = this.lexicAnalyzer.getToken();
            if (token === Token.ARROW) {
                let node1: Node = null;
                if (this._LLD_(node1)) {
                    node.right = node1;
                    return true;
                }
            }
        }
        return false;
    };
    public readonly _LI_ = (node: Node) => {
        let token: number = this.lexicAnalyzer.getToken();
        if (token === Token.SYMBOL) {
            node = new Node(this.lexicAnalyzer.getCurrentLexem());
            return true;
        }
        return false;
    };
    public readonly _LLD_ = (node: Node) => {
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
    public readonly _LD_ = (node: Node) => {
        return this._LS_(node);
    };
    public readonly _LS_ = (node: Node) => {
        let token: number = this.lexicAnalyzer.getToken();
        if (token === Token.SYMBOL) {
            node = new Node(this.lexicAnalyzer.getCurrentLexem());
            if (this._LS_(node)){
                let s: object = this.lexicAnalyzer.getLexicState();
                let node1: Node = null;
                if (this._LS_(node1)) {
                    node.right = node1;
                    return true;
                }
                this.lexicAnalyzer.setLexicState(s);
            }
            return true;
        }
    };


    
}

export { SyntaxAnalyzerGrammar };
