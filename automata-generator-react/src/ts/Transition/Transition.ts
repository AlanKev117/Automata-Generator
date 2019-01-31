import State from "../State/State";
class Transition {
	private symbol: string;
	private targetState: State;

	constructor (symbol: string, targetState: State) {
		this.symbol = symbol;
		this.targetState = targetState;
	}
}
export default Transition;