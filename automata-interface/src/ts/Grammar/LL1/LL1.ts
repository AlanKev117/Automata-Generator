import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";

class LL1 {
	private G: Gramatica; //lista de reglas
	private LL1Table: object;

	constructor(G: Gramatica) {
		this.G = G;
		this.LL1Table = this.createLL1Table();
	}

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
		const table = {};

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

		return table;
	};

	public readonly evaluate = (input: string) => {
		const stack = ["$"];
		
	};
}

export { LL1 };
