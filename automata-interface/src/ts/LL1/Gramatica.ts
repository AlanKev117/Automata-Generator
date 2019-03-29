import { Node } from "./Node";

class Gramatica {
    
    public nonTerminals: Set<string>;
    public terminals: Set<string>;
    public startSymbol: string;
    public rules: Node;

    constructor () {
        this.rules = null;
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

    private readonly rightSideToString = (rightSide: Node) => {
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
        const leftSidesAndGammas : object = {};
        for (let leftSide = this.rules; leftSide !== null; leftSide = leftSide.down) {
            for (let rightSide = leftSide.right; rightSide !== null; rightSide = rightSide.down) {
                for (let aux = rightSide; aux.right !== null; aux = aux.right) {
                    if (aux.symbol === symbol) {
                        leftSidesAndGammas[leftSide.symbol] = [];
                        while (aux.right !== null) {
                            leftSidesAndGammas[leftSide.symbol].push(aux.symbol);
                            aux = aux.right;
                        }
                    }
                }
            }
        }
        return leftSidesAndGammas;
    }

}

export { Gramatica };
