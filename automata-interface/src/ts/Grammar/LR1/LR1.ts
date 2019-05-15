import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";
import { Item } from "./Item";

class LR1 {
    private G: Gramatica;
    private LR1Table: object;
    private rules: object;

    constructor(G: Gramatica) {
        this.G = G;
        this.augmentGammar();
        this.rulesToObject();
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
    private readonly rulesToObject = () => {
        this.rules = {};
        for (
            let leftSide = this.G.rules;
            leftSide !== null;
            leftSide = leftSide.down
        ) {
            this.rules[leftSide.symbol] = [];
            for (let rule = leftSide.right; rule !== null; rule = rule.down) {
                let ruleString = "";
                for (let aux = rule; aux !== null; aux = aux.right) {
                    ruleString += aux.symbol;
                }
                this.rules[leftSide.symbol].push(ruleString);
            }
        }
    };

    /**
     * Cerradura épsilon para las gramáticas LR1 de un conjunto de Items.
     *
     * @private
     * @memberof LR1
     */
    private readonly epsilonClosure = (rules: Item[]) => {

        // Se agregan al conjunto resultado las reglas que se pasan como argumento.
        // Tratamos al conjunto temporalmente como un arreglo para mayor rapidez
        // en las operaciones de lectura y escritura.
        const closure = [...rules];

        //Agregamos el resto de reglas según el contenido de closure.
        for (let item of closure) {
            // Obtenemos el lado derecho de la regla del item.
            const rightSide = Object.values(item.rule)[0];

            // Obtenemos el índice del símbolo después del punto.
            const afterDotIndex = rightSide.indexOf(Misc.DOT) + 1;

            // Con él, obtenemos el símbolo después del punto.
            const afterDotSymbol = rightSide[afterDotIndex];

            // Si el símbolo (B) es no terminal,
            if (this.G.nonTerminals.has(afterDotSymbol)) {
                // Obtenemos las producciones crudas que genera B.
                const productions = this.rules[afterDotSymbol];
                // Por cada una,
                for (let prod of productions) {
                    // Se calcula FIRST del conjunto formado por los símbolos después de B
                    // y los terminales del item.
                    const first = this.firstLR1(
                        [...rightSide.slice(afterDotIndex + 1)].concat(item.terminals)
                    );

                    // Para cada símbolo del FIRST,
                    for (let symbol of first) {
                        // Se genera un nuevo item.
                        const newProd = {};
                        newProd[afterDotSymbol] = Misc.DOT + prod;
                        const newItem = new Item(newProd, [symbol]);

                        // Si ese item no se encuentra en la cerradura, se agrega.
                        if (!closure.find(_item => _item.equals(newItem))) {
                            closure.push(newItem);
                        }
                    }
                }
            }
        }

        return closure;
    };

    /**
     * Obtiene el conjunto FIRST de un conjunto de símbolos.
     *
     * @private
     * @memberof LR1
     */
    private readonly firstLR1 = (symbols: string[]) => {
        /**
         * Tratamos al set first como un arreglo para mantener el orden,
         * que es necesario para la generación de la tabla LR1.
         */
        const set = [];

        /**
         * Se verifica el caso básico, que es cuando el primer símbolo es un terminal.
         */
        if (
            this.G.terminals.has(symbols[0]) ||
            symbols[0] === Misc.SAFE_EPSILON ||
            symbols[0] === Misc.PESOS
        ) {
            set.push(symbols[0]);
            return set;
        }

        /**
         * En caso de que symbols[0] no sea terminal, se procede a obtener
         * el FIRST de los lados derechos de dicho símbolo.
         */
        const rightSides = this.rules[symbols[0]];
        for (let rightSide of rightSides) {
            // Se unen los conjuntos.
            const nextFirst = this.firstLR1([...rightSide]);
            nextFirst.forEach(symbol => {
                if (!set.includes(symbol)) {
                    set.push(symbol);
                }
            });
        }

        /**
         * Caso donde se incluya épsilon en el conjunto.
         */
        if (set.includes(Misc.SAFE_EPSILON) && symbols.length > 1) {
            delete set[set.indexOf(Misc.SAFE_EPSILON)];
            symbols.shift();
            const nextFirst = this.firstLR1(symbols);
            nextFirst.forEach(symbol => {
                if (!set.includes(symbol)) {
                    set.push(symbol);
                }
            });
        }

        return set;
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

export { LR1 };
