class Node {
    public symbol: string;
    public right: Node;
    public down: Node;

    constructor (symbol: string) {
        this.symbol = symbol;
        this.right = null;
        this.down = null;
    }
}


export { Node }