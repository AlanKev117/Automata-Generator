import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";
import { Item } from "./Item";
import { LexicAnalyzer } from "../../LexicAnalyzer/LexicAnalyzer";
import { SyntaxAnalyzerRegex } from "../../Regex/SyntaxAnalyzerRegex";

class LR1 {
	// Gramática
	public G: Gramatica;

	// Tabla LR1
	public LR1Table: object[];

	// Objeto con Object.keys:str[] y Object.values:str[][]
	private rules: object;

	// Arreglo con objetos con una sola regla de la forma {rightSide: leftSide}
	private arrayRules: object[];

	constructor(G: Gramatica) {
		this.G = G;
		this.rules = null;
		this.arrayRules = null;
		this.LR1Table = null;
		// this.augmentGrammar(); // Creo que no es necesario aumentar gramática.
		this.mapRules();
		this.createLR1Table();
	}

	/**
	 * Evalua si una cadena puede ser analizada por el analizador LR(1).
	 * Requiere de un conjunto de tokens y expresiones regulares para hacer un analizador léxico.
	 * 
	 * @param {string} input es la entrada a analizar.
	 * @param {number[]} tokens es el arreglo de tokens indexado igual que [...this.G.terminals]
	 * @param {string[]} regExps es el arreglo de expresiones regulares indexado igual que [tokens].
	 * 
	 *
	 * @memberof LR1
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
			"Lexic LR1",
			input + "$"
		);

		/**
		 * Inicia el algoritmo de análizis de la cadena.
		 */

		// Creamos un mapa que nos dará los símbolos terminales de los tokens
		// confiando que los tokens están igual indexados que los terminales.
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
		let symbol: string = terminalOf[lexicAnalyzer.getToken()];
		// Obtenemos la primer operación de la tabla.
		let op: string = this.LR1Table[row][symbol];

		// Mientras haya alguna operación qué hacer en la tabla.
		while (op) {
			if (op.startsWith("s")) {
				stack.push(symbol);
				stack.push(+op[1]);
				symbol = terminalOf[lexicAnalyzer.getToken()];
			} else if (op.startsWith("r")) {
				// Verificamos que sea la operación aceptar.
				if (op === "r0") {
					return true;
				}
				// Obtenemos el índice de la regla por la que se hace la reducción.
				const ruleIndex = +op[1];
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
				stack.push(this.LR1Table[peekSymbol][leftSide]);
			}
			// Siempre actualizamos la fila de la tabla en cada iteración.
			row = stack[stack.length - 1];
			// Así como la siguiente operación por hacer.
			op = this.LR1Table[row][symbol];
		}

		// No hubo operación qué hacer para cierto par.
		return false;
	};

	private readonly createLR1Table = () => {
		// Declaración de la tabla (arreglo de objetos).
		this.LR1Table = [];

		// Creación del primer Item
		const rule = {};
		rule[this.G.startSymbol] = Misc.DOT + this.rules[this.G.startSymbol][0];
		const firstItem = new Item(rule, [Misc.PESOS]);

		// Creamos un arreglo para identificar los conjuntos por analizar, empezando por S0.
		const S: Item[][] = [this.epsilonClosure([firstItem])];

		// Analizamos los elementos del arreglo.
		for (const set of S) {
			// Renglón de la tabla LR1.
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

				for (const terminal of endItem.terminals) {
					// Si ya ha sido definida una operación shift en la casilla, se detiene el procedimiento.
					if (row[terminal]) {
						console.log("Colición shift/reduce");
						this.LR1Table = null;
						return;
					}

					// Se registra la operación reduce con el índice de la regla por
					// la que se lleva a cabo.
					row[terminal] = "r" + ruleIndex;
				}
			}

			// Ya registradas las operaciones en el renglón, lo anexamos a la tabla LR1.
			this.LR1Table.push(row);
		}
		console.log("TABLA LR1: " + this.LR1Table);
	};

	/**
	 * Aumenta una gramática.
	 *
	 * @private
	 * @memberof LR1
	 */
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
	 * Establece los valores de this.rules y this.arrayRules, según sus definiciones.
	 *
	 * @private
	 * @memberof LR1
	 */
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
					// Se calcula FIRST del conjunto formado por los símbolos después de B
					// y los terminales del item.
					const first = this.firstLR1(
						[...rightSide.slice(afterDotIndex + 1)].concat(
							item.terminals
						)
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
	 * Función Ir_a(). Aplica la función Mover() con los parámetros
	 * "item" que es un conjunto de estados y "symbol" que es un
	 * símbolo. Al resultado se le
	 *
	 *
	 * @param {Array<Item>} states
	 * @param {string} symbol
	 * @returns {Array<Item>}
	 * @memberof LR1
	 */
	public readonly goTo = (states: Array<Item>, symbol: string) => {
		return this.epsilonClosure(this.move(states, symbol));
	};

	/**
	 * Función Mover(). Obtiene el conjunto de estados al que se
	 * puede acceder desde otro conjunto de estados "Items"
	 * estrictamente mediante transiciones con un símbolo "symbol"
	 * dado.
	 *
	 * @param {Array<Item>} state
	 * @param {string} symbol
	 * @returns {Array<Item>}
	 * @memberof LR1
	 */
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

	/**
	 * Obtiene un conjunto con todos los símbolos que se encuentran después del
	 * punto de la regla de cada item, de existir.
	 *
	 * @private
	 * @memberof LR1
	 */
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

	/**
	 * Desplaza el punto de un item a la derecha una posición.
	 *
	 * @private
	 * @memberof LR1
	 */
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

export { LR1 };
