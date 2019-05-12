import { Node } from "./Node";
import { timingSafeEqual } from "crypto";

class Gramatica {
	public nonTerminals: Set<string>;
	public terminals: Set<string>;
	public startSymbol: string;
	public rules: Node;
	public name: string;

	constructor(name: string) {
		this.rules = null;
		this.startSymbol = null;
		this.nonTerminals = new Set<string>();
		this.terminals = new Set<string>();
		this.name = name;
	}

	public readonly getRightSidesWith = (symbol: string) => {
		const rightSides: Set<string> = new Set<string>();
		for (
			let leftSide = this.rules;
			leftSide != null;
			leftSide = leftSide.down
		) {
			for (
				let rightSide = leftSide.right;
				rightSide != null;
				rightSide = rightSide.down
			) {
				const rightSideStr = this.rightSideToString(rightSide);
				if (leftSide.symbol === symbol) {
					rightSides.add(rightSideStr);
				} else {
					break;
				}
			}
		}
		return rightSides;
	};

	public readonly rightSideToString = (rightSide: Node) => {
		let str = "";
		for (let node = rightSide; node != null; node = node.right) {
			str += node.symbol;
		}
		return str;
	};

	/**
	 * Obtiene el símbolo no terminal y el sufijo del lado derecho de las
	 * reglas que contengan symbol en el lado derecho en caso de existir.
	 *
	 * @param {string} symbol
	 * @returns {object}
	 *
	 * @memberof Gramatica
	 */
	public readonly getLeftSidesAndGammasWith = (symbol: string) => {
		const leftSidesAndGammas: object = {};
		for (
			let leftSide = this.rules;
			leftSide !== null;
			leftSide = leftSide.down
		) {
			for (
				let rightSide = leftSide.right;
				rightSide !== null;
				rightSide = rightSide.down
			) {
				for (let aux = rightSide; aux.right !== null; aux = aux.right) {
					if (aux.symbol === symbol) {
						leftSidesAndGammas[leftSide.symbol] = [];
						while (aux.right !== null) {
							leftSidesAndGammas[leftSide.symbol].push(
								aux.symbol
							);
							aux = aux.right;
						}
					}
				}
			}
		}
		return leftSidesAndGammas;
	};

	public setNonTerminals = (root: Node) => {
		const nonTerminals = [];
		for (let node: Node = root; node != null; node = node.down) {
			nonTerminals.push(node.symbol);
		}
		this.nonTerminals = new Set<string>(nonTerminals);
	};

	public setTerminals = (root: Node) => {
		let terminals: string[] = [];
		for (
			let leftSide: Node = root;
			leftSide != null;
			leftSide = leftSide.down
		) {
			terminals = terminals.concat(this.getTerminalsFromBranch(leftSide.right));
		}
		this.terminals = new Set<string>(terminals);
	};

	private getTerminalsFromBranch = (branch: Node) => {
		let terminals = [];
		for (let aux = branch; aux != null; aux = aux.right) {
			if (!this.nonTerminals.has(aux.symbol)) {
				terminals.push(aux.symbol);
			}
			if (aux.down != null) {
				terminals = terminals.concat(this.getTerminalsFromBranch(aux.down));
			}
		}
		return terminals;
	};
}

export { Gramatica };
