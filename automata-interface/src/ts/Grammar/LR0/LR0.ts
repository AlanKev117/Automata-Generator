import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";
import { Item } from "../LR1/Item";
import { LexicAnalyzer } from "../../LexicAnalyzer/LexicAnalyzer";
import { SyntaxAnalyzerRegex } from "../../Regex/SyntaxAnalyzerRegex";

class LR0{
    	// Gramática
	public G: Gramatica;

	// Tabla LR0
	public LR0Table: object[];

	// Objeto con Object.keys:str[] y Object.values:str[][]
	private rules: object;

	// Arreglo con objetos con una sola regla de la forma {rightSide: leftSide}
	private arrayRules: object[];

	constructor(G: Gramatica) {
		this.G = G;
		this.rules = null;
		this.arrayRules = null;
		this.LR0Table = null;
		// this.augmentGrammar(); // Creo que no es necesario aumentar gramática.
        this.augmentGrammar();
        this.mapRules();
        this.createLR0Table();
        
    }
    
    private readonly createLR0Table = () => {
		// Declaración de la tabla (arreglo de objetos).
		this.LR0Table = [];

		// Creación del primer Item
		const rule = {};
		rule[this.G.startSymbol] = Misc.DOT + this.rules[this.G.startSymbol][0];
        const firstItem = new Item(rule, [Misc.PESOS]);
        console.log(JSON.stringify(rule));

		// Creamos un arreglo para identificar los conjuntos por analizar, empezando por S0.
		const S: Item[][] = [this.epsilonClosure([firstItem])];

		// Analizamos los elementos del arreglo.
		for (const set of S) {
			// Renglón de la tabla LR0.
			const row = {};

			// Obtenemos aquellos símbolos que se encuentran después del punto
			// de todos los items del conjunto (set) actual.
			const symbolsAfterDot = this.getSymbolsAfterDot(set);

			// Iteramos a través de ellos para rellenar el renglón row.
			for (const symbol of symbolsAfterDot) {
				// Obtenemos el conjunto al que se transita con el símbolo actual.
				const newSet: Item[] = this.goTo(set, symbol);

				// Obtenemos el conjunto que coincida con el nuevo, en caso de existir.
				const found = S.find(
					// (Se usa stringify() para obtener una cadena del objeto y comparar
					// por valor y no por referencia)
					_set => {
						const str1 = JSON.stringify(_set);
                        const str2 = JSON.stringify(newSet);
						return str1 === str2;
					}
				);

				// Obtenemos el índice del conjunto nuevo.
				let indexOfNewSet: number = found
					? S.indexOf(found) // Si existe, su índice correspondiente.
					: S.push(newSet) - 1; // Si no, se agrega y se asigna el índice del último elemento.

				if (this.G.nonTerminals.has(symbol)) {
					// Si el símbolo actual es un no terminal, se registra el índice del conjunto a la.
					// casilla correspondiente del renglón.
					row[symbol] = indexOfNewSet;
				} else if (this.G.terminals.has(symbol)) {
					// Si es un terminal, se registra una operación shift "s".
					row[symbol] = "s" + indexOfNewSet;
				}
			}

			// Filtramos los items que tienen reglas de la forma A -> B• y creamos una copia de ellos
			// sin el punto.
			const endItems: Item[] = set
				.filter(
					item =>
						Object.values(item.rule)[0].split(Misc.DOT)[1]
							.length === 0
				)
				.map(item => {
					const endItem = item.copy();
					const leftSide: string = Object.keys(endItem.rule)[0];
					const rightSide: string = Object.values(endItem.rule)[0];
					endItem.rule[leftSide] = rightSide.split(Misc.DOT)[0];
					return endItem;
				});

			// Iteramos a través de esos items para obtener las operaciones reduce "r"
			for (const endItem of endItems) {
				// Se obtiene el índice de la regla del item actual.
				const ruleIndex = this.arrayRules.indexOf(
					this.arrayRules.find(
						rule =>
							JSON.stringify(rule) ===
							JSON.stringify(endItem.rule)
					)
				);

				for (const terminal of this.G.terminals ) {
					// Si ya ha sido definida una operación shift en la casilla, se detiene el procedimiento.
                    
                    if (row[terminal]) {
                        alert("La gramática no es LR0 \n" 
                        + "Introduzca una gramática no ambigua \n" 
                        + "y no recursiva por la izquierda");
						this.LR0Table = [];
						return;
                    }
                    

					// Se registra la operación reduce con el índice de la regla por
					// la que se lleva a cabo.
                    if(ruleIndex != 0) row[terminal] = "r" + ruleIndex;
                    row[Misc.PESOS] = "r" + ruleIndex;
				}
			}

			// Ya registradas las operaciones en el renglón, lo anexamos a la tabla LR1.
			this.LR0Table.push(row);
        }
        for(let i = 0; i < S.length; i++){
            console.log("Estado [" + i + "] = " + JSON.stringify(S[i]));
        }
        console.log("TABLA LR1: " + this.LR0Table);
    };

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
        input += Misc.PESOS;
        // alert(input);

		// Creamos el objeto de tokens para el analizador léxico.
		const _tokens = {};
		tokens.forEach((token, i) => (_tokens[regExps[i]] = token));
		_tokens["$"] = -2; // Valor -2 simboliza el token PESOS.

		// Creamos el analizador léxico para analizar input (concatenando $).
		const lexicAnalyzer = new LexicAnalyzer(
			automata,
			_tokens,
			"Lexic LR0",
			input + "$"
        );

        const terminalOf = {};
		[...this.G.terminals].forEach((t, i) => {
			terminalOf[tokens[i]] = t;
		});
		terminalOf[-2] = "$";

		// La pila es un arreglo para mayor eficiencia.
		const stack: (number | string)[] = [0];
		// La fila de la tabla por empezar es la 0.
		let row = stack[stack.length - 1];
		// Obtenemos el símbolo del primer token.
        //let symbol: string = terminalOf[lexicAnalyzer.getToken()];
        let index: number = 0;
		let symbol: string = input[index];
		console.log(input);
        console.log("Entrada = " + symbol)
		// Obtenemos la primer operación de la tabla.
		let op: string = this.LR0Table[row][symbol];
		
        console.log("Pila: " + stack);
        while (op) {
			if (op.startsWith("s")) {
				stack.push(symbol);
                stack.push(+(parseInt(op.split("s")[1])));
                console.log("Pila: " + stack);
                //symbol = terminalOf[lexicAnalyzer.getToken()];
                index++;
                symbol = input[index];
                console.log("Entrada = "+ symbol)
			} else if (op.startsWith("r")) {
				// Verificamos que sea la operación aceptar.
				if (op === "r0") {
					return true;
				}
				// Obtenemos el índice de la regla por la que se hace la reducción.
				const ruleIndex = +(parseInt(op.split("r")[1]));
				// Obtenemos la regla.
				const rule = this.arrayRules[ruleIndex];
				// Obtenemos el lado derecho de la regla.
				const rightSide: string = Object.values(rule)[0];
				// Hacemos 2 pop() en la pila por cada símbolo del lado derecho.
				[...rightSide].forEach(() => {
					stack.pop();
					stack.pop();
                });
				// Obtenemos el último símbolo de la pila después de hacer esas operaciones.
				const peekSymbol = stack[stack.length - 1];
				// Obtenemos el lado izquierdo de la gramática.
				const leftSide: string = Object.keys(rule)[0];
				// Metemos el lado izquierdo en la pila
				stack.push(leftSide);
				// Metemos el símbolo de la tabla que corresponde al par de los dos últimos símbolos
				// de la pila.
                console.log(this.LR0Table);
                console.log(peekSymbol);
                console.log(this.LR0Table[peekSymbol]);
                stack.push(this.LR0Table[peekSymbol][leftSide]);
                console.log("Pila: " + stack);
			}
			// Siempre actualizamos la fila de la tabla en cada iteración.
			row = stack[stack.length - 1];
			// Así como la siguiente operación por hacer.
			op = this.LR0Table[row][symbol];
		}

		// No hubo operación qué hacer para cierto par.
		return false;
    }
    
    private readonly augmentGrammar = () => {
		if (this.G === null) {
			return;
		}
		const augmentedSymbol = this.getGreekFromLatin(this.G.rules.symbol);
		if (augmentedSymbol === null) {
			return;
		}
		const augmentedNode = new Node(augmentedSymbol);
		augmentedNode.right = new Node(this.G.startSymbol);
		augmentedNode.down = { ...this.G.rules };
		this.G.rules = augmentedNode;
		this.G.startSymbol = augmentedSymbol;
		this.G.nonTerminals.add(augmentedSymbol);
	};

	/**
	 * Obtiene el respectivo caracter griego de uno latino.
	 *
	 * @private
	 * @memberof LR0
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


    private readonly mapRules = () => {
		this.rules = {};
		this.arrayRules = [];

		for (
			let leftSide = this.G.rules;
			leftSide !== null;
			leftSide = leftSide.down
		) {
			this.rules[leftSide.symbol] = [];
			for (let rule = leftSide.right; rule !== null; rule = rule.down) {
				// Convertimos el lado derecho en una cadena.
				let ruleString = "";
				for (let aux = rule; aux !== null; aux = aux.right) {
					ruleString += aux.symbol;
				}

				// La agregamos a las cadenas cuya clave es el lado izquierdo actual.
				this.rules[leftSide.symbol].push(ruleString);

				// Agregamos una regla al conjunto indexado.
				const newRule = {};
				newRule[leftSide.symbol] = ruleString;
				this.arrayRules.push(newRule);
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
		const closure = rules.map(rule => rule.copy());

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
						const newProd = {};
						newProd[afterDotSymbol] = Misc.DOT + prod;
						const newItem = new Item(newProd, [afterDotSymbol]);
						if (!closure.find(_item => _item.equals(newItem))) {
							closure.push(newItem);
						}
				}
			}
		}

		return closure;
	};

    public readonly goTo = (states: Array<Item>, symbol: string) => {
		return this.epsilonClosure(this.move(states, symbol));
	};

    public readonly move = (state: Array<Item>, symbol: string) => {
		// Tomamos el conjunto de items del estado que tengan nuestro symbol
		const items: Item[] = []; // Aquí va la modificación, Ralph.
		for (let regla of state) {
			// Obtenemos el lado derecho de la regla del item.
			let rightSide = Object.values(regla.rule)[0];

			// Obtenemos el índice del símbolo después del punto.
			let afterDotIndex = rightSide.indexOf(Misc.DOT) + 1;

			// Con él, obtenemos el símbolo después del punto.
			let afterDotSymbol = rightSide[afterDotIndex];
			// Si el símbolo despues del simbolo es igual al simbolo que mandamos
			if (afterDotSymbol == symbol) {
				//metemos el item dentro del arreglo
				items.push(regla.copy());
			}
		}
		//ahora por cada item de nuestro conjunto de items
		for (let item of items) {
			//cambiamos de posición nuestro punto
			this.shiftDot(item);
		}
		return items;
	};


	private readonly getSymbolsAfterDot = (items: Item[]) => {
		// Declaramos arreglo de los símbolos que van después del punto en cada item.
		const symbolsAfterDot: string[] = [];
		// Iteramos a través de los items.
		items.forEach(item => {
			// Obtenemos el lado derecho de la regla del item.
			const rightSide: string = Object.values(item.rule)[0];
			// Obtenemos el índice del punto del item.
			const dotIndex = rightSide.indexOf(Misc.DOT);
			// Verificamos que el punto no sea el último caracter del lado derecho.
			if (dotIndex !== rightSide.length - 1) {
				// Para así obtener el símbolo que le sigue.
				const symbolAfterDot = rightSide[dotIndex + 1];
				// Finalmente, verificamos que ese símbolo no exista en el conjunto.
				if (!symbolsAfterDot.includes(symbolAfterDot)) {
					// De ser así, lo agregamos.
					symbolsAfterDot.push(symbolAfterDot);
				}
			}
		});

		return symbolsAfterDot;
    };
    
    private readonly shiftDot = (item: Item) => {
		const leftSide = Object.keys(item.rule)[0];
		const parts = item.rule[leftSide].split(Misc.DOT);
		if (parts[1].length > 0) {
			parts[0] += parts[1][0];
			parts[1] = parts[1].slice(1);
		}
		item.rule[leftSide] = parts.join(Misc.DOT);
	};
}

export { LR0 };