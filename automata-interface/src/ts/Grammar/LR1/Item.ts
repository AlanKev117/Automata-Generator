class Item {
    public rule: object;
    public terminals: string[];

    constructor(rule: object, terminals: string[]) {
        const val = Object.values(rule)[0];
        const key = Object.keys(rule)[0];
        this.rule[key] = val;
        this.terminals = [...terminals];
    }

    public readonly equals = (item: Item) => {
        return JSON.stringify(this) === JSON.stringify(item);
    };
}

export { Item };
