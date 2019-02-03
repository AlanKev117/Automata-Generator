import State from "../State/State";

class Transition {
	public symbol: string;
	public limitSymbol: string;
	public targetState: State;

	constructor (symbol: string, targetState: State, limitSymbol?: string) {
		// Se sgrega el símbolo principal de la transición.
		this.symbol = symbol;
		// Se establece el estado objetivo.
		this.targetState = targetState;
		// Se establece el símbolo límite (para rangos), si existe.
		if (limitSymbol) {
			if (symbol.length != 1 || limitSymbol.length != 1) {
				console.log("La longitud de ambos símbolos para un rango debe ser 1");
				return null;
			}
			if (limitSymbol <= symbol) {
				console.log("No es posible crear la transición con ese rango.");
				return null;
			}
			this.limitSymbol = limitSymbol;
		} else {
			this.limitSymbol = null;
		}
	}

	hasLimitSymbol = () => {
		return this.limitSymbol ? true : false;
	}
}
export default Transition;