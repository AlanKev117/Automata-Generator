import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";

class LR1 {
    private G: Gramatica;
    private LR1Table: object;
    private rules: object;

    constructor(G: Gramatica) {
        this.G = G;
        this.augmentGammar();
        this.rulesToItems();
        this.LR1Table = this.createLR1Table();
    }

    public readonly evaluate = (input: string) => {};

    private readonly createLR1Table = () => {
        const table = {};
        return table;
    };

    /**
     * Aumenta una gramática.
     *
     * @private
     * @memberof LR1
     */
    private readonly augmentGammar = () => {
        if (this.G === null) {
            return;
        }
        const augmentedSymbol = this.getGreekFromLatin(this.G.rules.symbol);
        const augmentedNode = new Node(augmentedSymbol);
        augmentedNode.right = new Node(this.G.startSymbol);
        augmentedNode.down = { ...this.G.rules };
        this.G.rules = augmentedNode;
    };

    /**
     * Obtiene el respectivo caracter griego de uno latino.
     *
     * @private
     * @memberof LR1
     */
    private readonly getGreekFromLatin = (latinChar: string) => {
        if (latinChar.length !== 1 || latinChar === null) {
            return null;
        } else if ("A" <= latinChar && latinChar <= "Z") {
            return String.fromCharCode(
                0x0391 + latinChar.charCodeAt(0) - "A".charCodeAt(0)
            );
        } else if ("a" <= latinChar && latinChar <= "z") {
            return String.fromCharCode(
                0x03b1 + latinChar.charCodeAt(0) - "a".charCodeAt(0)
            );
        } else {
            return null;
        }
    };

    /**
     * Convierte las reglas de la gramática dada a un objeto
     * cuyas claves guardan items.
     *
     * @private
     * @memberof LR1
     */
    private readonly rulesToItems = () => {
        this.rules = {};
        for (
            let leftSide = this.G.rules;
            leftSide !== null;
            leftSide = leftSide.down
        ) {
            this.rules[leftSide.symbol] = [];
            for (let rule = leftSide.right; rule !== null; rule = rule.down) {
                let ruleString = Misc.DOT;
                for (let aux = rule; aux !== null; aux = aux.right) {
                    ruleString += aux.symbol;
                }
                this.rules[leftSide.symbol].push(ruleString);
            }
        }
    };

    /**
     * Cerradura épsilon para las gramáticas LR1.
     *
     * @private
     * @memberof LR1
     */
    private readonly epsilonClosure = (rules: Set<[object, Set<string>]>) => {
        // Se agregan al conjunto resultado las reglas que se pasan como argumento.
        // Tratamos al conjunto temporalmente como un arreglo para mayor rapidez
        // en las operaciones de lectura y escritura.
        const closure = [...rules];

        //Agregamos el resto de reglas según el contenido de res.
        for (let pair of closure) {
            
        }
    };

    /**
     * Desplaza una vez el punto de un conjunto de items a la derecha.
     *
     * @private
     * @memberof LR1
     */
    private readonly shiftDot = (rules: object) => {
        for (let leftSide in rules) {
            rules[leftSide].forEach((rule: string) => {
                const parts = rule.split(Misc.DOT);
                if (parts[1].length > 0) {
                    parts[0] += parts[1][0];
                    parts[1] = parts[1].slice(1);
                }
                rule = parts.join(Misc.DOT);
            });
        }
    };
}
