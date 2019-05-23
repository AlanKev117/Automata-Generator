class Node {
    public symbol: string;
    public right: Node;
    public down: Node;

    constructor (symbol: string) {
        this.symbol = symbol;
        this.right = null;
        this.down = null;
    }

    public toString = () => {
        let s = "";
        for (let node = <Node>this; node !== null; node = node.right ) {
            s += node.symbol;
        }
        return s;
    };
}


export { Node }