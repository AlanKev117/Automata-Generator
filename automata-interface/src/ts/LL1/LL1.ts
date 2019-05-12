import Misc from "../Misc/Misc";
import { Gramatica } from "./Gramatica";
import { Node } from "./Node";

class LL1 {
	private G: Gramatica; //lista de reglas

	constructor(G: Gramatica) {
		this.G = G;
	}

	public readonly first = (symbols: Array<string>) => {
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
			set.delete("\u03B5");
			symbols.shift();
			set = new Set<string>([...set].concat(...this.first(symbols)));
		}

		return set;
	};

	public readonly follow = (symbol: string) => {
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

	public createLL1Table() {
		// const head = this.G.rules;
		// const table = {};
		// for (
		//     let leftSide: Node = this.G.rules, ruleIndex: number = 0;
		//     leftSide != null;
		//     leftSide = leftSide.down
		// ) {
		//     const transSymbols = this.first([
		//         ...this.G.rightSideToString(head)
		//     ]);
		//     transSymbols.forEach(symbol => {
		//         if (!table[leftSide.symbol]) {
		//             table[leftSide.symbol] = {};
		//         }
		//         table[leftSide.symbol][symbol] = [
		//             this.G.rightSideToString(leftSide.right),
		//             ruleIndex++
		//         ];
		//     });
		// }
		const head: Node = this.G.rules;
	}

	/**
	 * Regresa un arreglo de nodos (reglas) donde los índices
	 * identifican a cada regla pra la tabla LL1.
	 *
	 * @private
	 * @memberof LL1
	 * @param {Node} rules El nodo de las reglas de una gramática
	 * @returns {Node[]}
	 */
	private enumerateRules = (rules: Node) => {
		const enumRules: Node[] = [];
		for (let aux = rules; aux != null; aux = aux.down) {
			const current = new Node(aux.symbol);
			//for (let )
		}
		return enumRules;
	};

	private getRulesFromBranch = (branch: Node) => {
		const rules = [];
		for (let aux = branch; aux != null; aux = aux.right) {
			
		}
	};
}

export { LL1 };
