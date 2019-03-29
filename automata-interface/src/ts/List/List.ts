import { Node } from "../LL1/Node";
class Lists {
    size: number;
    head: Node;
    constructor() {
        this.size = 0;
        this.head = null;
    }

    public append = (symbol, current) => {
        current = this.head;
        if (this.head === null) {
            return (this.head = new Node(symbol));
        }
        if (current.right === null) {
            return (current.right = new Node(symbol));
        }
        if (current.down === null) {
            return (current.down = new Node(symbol));
        }
        this.append(symbol, current.right);
        this.append(symbol, current.down);
    };

    public prepend = symbol => {
        if (this.head === null) {
            return (this.head = new Node(symbol));
        }
        let newNode = new Node(symbol);
        newNode.right = this.head;
        newNode.down = this.head;
        this.head = newNode;
    };

    public removeNode = (symbol, current) => {
        current = this.head;
        if (this.head === null) {
            // no head
            return false;
        }

        if (this.head.symbol === symbol) {
            return (this.head = this.head.right);
        }

        if (current.right !== null) {
            if (current.right.symbol === symbol) {
                return (current.right = current.right.right);
            }
            this.removeNode(symbol, current.right);
        }
        return false; // no match found
    };

    findNode = (symbol, current) => {
        current = this.head;
        if (this.head === null) {
            return false;
        }
        if (current !== null) {
            if (current.symbol === symbol) {
                return true;
            } else {
                return this.findNode(symbol, current.right);
            }
        }
        return false;
    };

    peekNode = symbol => {
        if (this.head === null) {
            return false;
        }
        return this.head;
    };

    listLength = (current, acum) => {
        current = this.head;
        acum = 1;
        if (this.head === null) {
            return 0;
        }
        if (current.right !== null) {
            return this.listLength(current.right, (acum = acum + 1));
        }
        return acum;
    };
}
export { Lists };
