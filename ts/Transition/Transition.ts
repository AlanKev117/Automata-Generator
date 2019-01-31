import State from "../State/State";

class Transition {
	private symbol: string;
	private limit: string;
	private targetState: State;

	constructor (symbol: string, targetState: State, limit?: string) {
		this.symbol = symbol;
		this.limit = limit ? limit : null;
		this.targetState = targetState;
	}
}
export default Transition;