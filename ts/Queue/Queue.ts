
class Queue{

    private dataStore;

    constructor(){
        this.dataStore = Array.prototype.slice.call(arguments, 0);
    }
    

    public queue = (element) => {
        this.dataStore.push(element);
    }

    public dequeue = () => {
        return this.dataStore.shift();
    }

    public isEmpty = () => {
        return (this.dataStore == 0)?true:false;
    }

    public size = () => {
        return this.dataStore.size;
    }
}

export { Queue };