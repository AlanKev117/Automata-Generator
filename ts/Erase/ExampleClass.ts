class ExampleClass {
	prop1: string;
	private readonly _this = this;

	constructor () {
		this.prop1 = "cadena chida";
	}

	holatyped (): void {
		console.log("Imprimiendo desde tipado: " + this.prop1);
	}

	readonly hola = () => {
		console.log("Imprimiendo desde arrow: " + this.prop1);
	}
}

export default ExampleClass;