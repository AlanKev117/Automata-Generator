import { Node } from "./Node";

class Gramatica {
    private head: Node;

    constructor() {
        this.head = null;
    }

    

    public readonly getRightSidesWith = (symbol: string) => {
        
        const rightSides: Set<string> = new Set<string>();
        for (
            let leftSide = this.head;
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
}

export { Gramatica };
