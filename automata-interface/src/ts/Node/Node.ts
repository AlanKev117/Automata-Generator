class Node{
    value;
    next: object;
    down: object;
    constructor(value){
        this.value = value
        this.next = null
        this.down = null
    }
}

export {Node}