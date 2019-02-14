class Queue<T> {
	private dataStore: Array<T>;

	constructor() {
		this.dataStore = [];
	}

	public queue = (element: T) => {
		this.dataStore.push(element);
	};

	public dequeue = () => {
		return <T>this.dataStore.shift();
	};

	public isEmpty = () => {
		return this.dataStore.length === 0;
	};

	public size = () => {
		return this.dataStore.length;
	};
}

export { Queue };
