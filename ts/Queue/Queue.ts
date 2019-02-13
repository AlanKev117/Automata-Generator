function Queue() {

    this.dataStore = Array.prototype.slice.call(arguments, 0);
    this.enqueue = queue;
    this.dequeue = dequeue;
    this.isEmpty = isEmpty;
    this.size = size;

    this.print = print;

    function queue(element) {
        this.dataStore.push(element);
    }

    function dequeue() {
        return this.dataStore.shift();
    }

    function isEmpty() {
        return (this.dataStore == 0)?true:false;
    }

    function size() {
        return this.dataStore.size;
    }
}

export { Queue };