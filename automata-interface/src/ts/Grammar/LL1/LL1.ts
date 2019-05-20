import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";
import { LexicAnalyzer } from "../../LexicAnalyzer/LexicAnalyzer";
import { Automaton } from "../../Automaton/Automaton";
import { SyntaxAnalyzerRegex } from "../../Regex/SyntaxAnalyzerRegex";
class LL1 {
    private G: Gramatica; //lista de reglas
    private LL1Table: Object[];
    public lexico: LexicAnalyzer;

    constructor(G: Gramatica) {
        this.G = G;
        this.LL1Table = this.createLL1Table();
    }
    /**
     * Evalua si una cadena puede ser analizada por el analizador LL(1).
     * Requiere de un conjunto de tokens y expresiones regulares para hacer un analizador léxico.
     *
     * @param {string} input
     * @param {number[]} tokens
     * @param {string[]} regExps
     * @returns
     */
    public readonly evaluate = (
        input: string,
        tokens: number[],
        regExps: string[]
    ) => {

        // Creamos autómatas para el analizador léxico
        const automata = regExps.map(regExp =>
            new SyntaxAnalyzerRegex(regExp).solve(regExp)
        );
        automata.push(new SyntaxAnalyzerRegex("$").solve("$"));

        // Nos cercioramos de que todas las expresiones fueron correctas
        const errorIndex = automata.indexOf(null);
        if (errorIndex !== -1) {
            alert("Error en expresión regular " + regExps[errorIndex]);
            return false;
        }

        // Creamos el objeto de tokens para el analizador léxico.
        const _tokens = {};
        tokens.forEach((token, i) => (_tokens[regExps[i]] = token));
        _tokens["$"] = -2; // Valor -2 simboliza el token PESOS.

        // Creamos el analizador léxico para analizar input (concatenando $).
        const lexicAnalyzer = new LexicAnalyzer(
            automata,
            _tokens,
            "Lexic LL1",
            input + "$"
        );

        /**
         * Inicio del algoritmo.
         */

        // Creamos un mapa que nos dará los símbolos terminales de los tokens
        // confiando que los tokens están igual indexados que los terminales.
        const terminalOf = {};
        [...this.G.terminals].forEach((t, i) => {
            terminalOf[tokens[i]] = t;
        });
        terminalOf[-2] = "$";

        // La pila es un arreglo para mejorar eficiencia.
        const stack: string[] = ["$", this.G.startSymbol];
        // La fila de la tabla por empezar es la 0.
        let row: string = stack[stack.length - 1];
        // Obtenemos el símbolo del primer token.
        let column: string = terminalOf[lexicAnalyzer.getToken()];
        // Obtenemos la primer operación de la tabla.
        let op: string = this.LL1Table[row][column];

        while (op) {
            // Verificamos si se trata de operación pop().
            if (row === column) {
                // Verificamos si es la operación aceptar.
                if (row === "$") {
                    return true;
                }
                // Si no, hacemos un pop en la pila;
                stack.pop();
                // Actualizamos la columna.
                column = terminalOf[lexicAnalyzer.getToken()];
            } else {
                // Hacemos pop en la pila
                stack.pop();
                // Agregamos
                const rule = op[0];
                [...rule].reverse().forEach(symbol => {
                    if (symbol !== Misc.SAFE_EPSILON) {
                        stack.push(symbol);
                    }
                });
            }
            // Actualizamos la fila de la tabla de donde
            // obtenemos las operaciones.
            row = stack[stack.length - 1];
            // Actualizamos la operación.
            op = this.LL1Table[row][column];
        }

        // No existió operación para el par dado.
        return false;
    };

    private readonly first = (symbols: Array<string>) => {
        //Declaramos conjunto vacio
        let set = new Set<string>();

        // Verificamos si el símbolo recibido es un terminal o épsilon.
        if (this.G.terminals.has(symbols[0]) || symbols[0] === Misc.EPSILON) {
            set.add(symbols[0]);
            return set;
        }

        // Si el símbolo es un no terminal, procedemos de la siguiente forma.
        const rightSides = this.G.getRightSidesWith(symbols[0]);
        for (let rightSide of rightSides) {
            set = new Set<string>(
                [...set].concat(...this.first(rightSide.split("")))
            );
        }

        if (set.has(Misc.EPSILON) && symbols.length != 1) {
            set.delete(Misc.EPSILON);
            symbols.shift();
            set = new Set<string>([...set].concat(...this.first(symbols)));
        }

        return set;
    };

    private readonly follow = (symbol: string) => {
        let set = new Set<string>();
        if (symbol === this.G.startSymbol) {
            set.add("$");
        }
        const gammas = this.G.getLeftSidesAndGammasWith(symbol);
        for (let leftSide in gammas) {
            if (gammas[leftSide].length !== 0) {
                set = new Set<string>(
                    [...set].concat(...this.first(gammas[leftSide]))
                );
                if (set.has(Misc.EPSILON)) {
                    set.delete(Misc.EPSILON);
                    set = new Set<string>(
                        [...set].concat(...this.follow(leftSide))
                    );
                }
            } else {
                if (leftSide === symbol) {
                    return new Set<string>();
                }
                set = new Set<string>(
                    [...set].concat(...this.follow(leftSide))
                );
            }
        }

        return set;
    };

    private readonly createLL1Table = () => {
        /* 
			Objeto de objetos (tabla LL1).
			Forma: table[NT o T o $][T o $] = [regla, indice de regla].
		*/
        const table = new Array();

        // Arreglo para indexar reglas.
        const rules: Node[] = [];

        // Iteramos a través de todos los lados izquierdos.
        for (
            let leftSide = this.G.rules;
            leftSide != null;
            leftSide = leftSide.down
        ) {
            // Iteramos a través de todas las reglas de esos lados izquierdos.
            for (let rule = leftSide.right; rule != null; rule = rule.down) {
                // Se agrega regla a arreglo para indexar.
                rules.push(rule);

                // Arreglo de todos los símbolos de la regla actual.
                const ruleSymbols = [...this.G.rightSideToString(rule)];

                // Se define nuevo objeto (fila) en caso de no existir.
                if (!table[leftSide.symbol]) {
                    table[leftSide.symbol] = {};
                }

                // Obtenemos first de la regla actual.
                const terminals = this.first(ruleSymbols);

                // Si en el resultado se tiene épsilon,
                if (terminals.has(Misc.EPSILON)) {
                    // se elimina del conjunto.
                    terminals.delete(Misc.EPSILON);

                    // Después se calcula el follow.
                    const followTerminals = this.follow(leftSide.symbol);

                    // El resultado se une con first.
                    followTerminals.forEach(terminal => {
                        terminals.add(terminal);
                    });
                }

                // Ya teniendo los terminales (columnas), se asignan valores a la tabla.
                terminals.forEach(column => {
                    table[leftSide.symbol][column] = [
                        rule,
                        rules.indexOf(rule)
                    ];
                });
            }
        }
        // Se omiten las operaciones pop en esta implementación, recordando que
        // table[s][s] = stack.pop() ; con s un terminal.
        console.log("TABLA LL1: " + table);
        return table;
    };
}

export { LL1 };
