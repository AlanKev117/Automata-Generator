class Node {
    public symbol: string;
    public right: Node;
    public down: Node;

    constructor (symbol: string) {
        this.symbol = symbol;
    }
}


export { Node }