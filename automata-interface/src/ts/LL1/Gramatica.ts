import { Node } from "./Node";

class Gramatica {
    private head: Node;

    constructor() {
        this.head = null;
    }

    public readonly getRightSidesWith = (symbol: string) => {
        const rightSides: Set<Node> = new Set<Node>();
        for (
            let currentHead = this.head;
            currentHead != null;
            currentHead = currentHead.down
        ) {
            for (
                let currentNode = currentHead.right;
                currentNode != null;
                currentNode = currentNode.right
            ) {
                if (currentNode.symbol === symbol) {
					rightSides.add(currentHead);
					break;
                }
            }
		}
		return rightSides;
    };
}

export { Gramatica };
