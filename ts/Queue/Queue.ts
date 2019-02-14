import { State } from "../State/State";

class Queue<T> {
	private dataStore: Array<T>;

	constructor() {
		this.dataStore = [];
	}

	public queue = element => {
		this.dataStore.push(element);
	};

	public dequeue = () => {
		return this.dataStore.shift();
	};

	public isEmpty = () => {
		return this.dataStore.length === 0;
	};

	public size = () => {
		return this.dataStore.length;
	};
}

export { Queue };
