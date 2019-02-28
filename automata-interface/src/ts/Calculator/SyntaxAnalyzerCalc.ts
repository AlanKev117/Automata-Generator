import { LexicAnalyzer } from "../LexicAnalyzer/LexicAnalyzer";
import { Automaton } from "../Automaton/Automaton";

enum Token {
	MAS,
	MENOS,
	PROD,
	DIV,
	POT,
	PAR_I,
	PAR_D,
	SIN,
	COS,
	TAN,
	EXP,
	LN,
	LOG,
	NUM
}

class SyntaxAnalyzerCalc {
	public lexico: LexicAnalyzer;

	constructor() {
		const tokens = { ...Token };
		const automata = this.createAutomataForLexic();
		this.lexico = new LexicAnalyzer(automata, tokens, "Calculadora Chida");
	}

	private createAutomataForLexic = () => {
		// Creación de autómatas básicos auxiliares.
		const autoI = new Automaton("I");
		autoI.createBasic("i");
		const autoN = new Automaton("N");
		autoN.createBasic("n");
		const autoO = new Automaton("O");
		autoO.createBasic("o");
		const autoS = new Automaton("S");
		autoS.createBasic("s");
		const autoA = new Automaton("A");
		autoA.createBasic("a");
		const autoX = new Automaton("X");
		autoX.createBasic("x");
		const autoP = new Automaton("P");
		autoP.createBasic("p");
		const autoG = new Automaton("G");
		autoG.createBasic("g");
		const autoDIGS = new Automaton("DIGS");
		autoDIGS.createBasic("0", "9");
		autoDIGS.makePositive();
		const autoDOT = new Automaton("DOT");
		autoDOT.createBasic(".");
		autoDOT.concatenarAFN(autoDIGS.copy());
		autoDOT.makeOptional();

		// Creamos los autómatas que nos servirán para hacer en analizador léxico
		// para obtener los tokens de ls expresiones matemáticas.
		const autoMAS = new Automaton("MAS");
		autoMAS.createBasic("+");
		const autoMENOS = new Automaton("MENOS");
		autoMENOS.createBasic("-");
		const autoPROD = new Automaton("PROD");
		autoPROD.createBasic("*");
		const autoDIV = new Automaton("DIV");
		autoDIV.createBasic("/");
		const autoPOT = new Automaton("POT");
		autoPOT.createBasic("^");
		const autoPAR_I = new Automaton("PAR_I");
		autoPAR_I.createBasic("(");
		const autoPAR_D = new Automaton("PAR_D");
		autoPAR_D.createBasic(")");
		// Creación de autómata seno.
		const autoSIN = new Automaton("SIN");
		autoSIN.createBasic("s");
		autoSIN.concatenarAFN(autoI.copy());
		autoSIN.concatenarAFN(autoN.copy());
		// Creación de autómata coseno.
		const autoCOS = new Automaton("COS");
		autoCOS.createBasic("c");
		autoCOS.concatenarAFN(autoO.copy());
		autoCOS.concatenarAFN(autoS.copy());
		// Creación de autómata tangente.
		const autoTAN = new Automaton("TAN");
		autoTAN.createBasic("t");
		autoTAN.concatenarAFN(autoA.copy());
		autoTAN.concatenarAFN(autoN.copy());
		// Autómata exp
		const autoEXP = new Automaton("EXP");
		autoEXP.createBasic("e");
		autoEXP.concatenarAFN(autoX.copy());
		autoEXP.concatenarAFN(autoP.copy());
		// Autómata ln
		const autoLN = new Automaton("LN");
		autoLN.createBasic("l");
		autoLN.concatenarAFN(autoN.copy());
		// Autómata log
		const autoLOG = new Automaton("LOG");
		autoLOG.createBasic("l");
		autoLOG.concatenarAFN(autoO.copy());
		autoLOG.concatenarAFN(autoG.copy());
		// Autómata para reconocer números.
		const autoNUM = new Automaton("NUM");
		// autoNUM.createBasic("+");
		// autoNUM.unirAFN(autoMENOS.copy());
		// autoNUM.makeOptional();
		// autoNUM.concatenarAFN(autoDIGS);
		// autoNUM.concatenarAFN(autoDOT);
		autoNUM.createBasic("0", "9");
		autoNUM.makePositive();
		autoNUM.concatenarAFN(autoDOT.copy());

		return [
			autoMAS,
			autoMENOS,
			autoPROD,
			autoDIV,
			autoPOT,
			autoPAR_I,
			autoPAR_D,
			autoSIN,
			autoCOS,
			autoTAN,
			autoEXP,
			autoLN,
			autoLOG,
			autoNUM
		];
	};

	public solve = (input: string) => {
		this.lexico.lexicAnalysis(input);
		const val: number[] = [];
		const str: string[] = [];
		if (this.G(val, str)) {
			console.log("El resultado es: " + val[0]);
			console.log("La notación es: " + str[0]);
		} else {
			console.log("p2");
		}
	};

	G = (v: number[], s:string[]) => {
		let tok: number;
		if (this.E(v,s)) {
			tok = this.lexico.getToken();
			if (!tok) {
				return true;
			}
		}
		return false;
	};

	E = (v: number[], s:string[]) => {
		if (this.T(v,s)) {
			if (this.Ep(v,s)) return true;
		}
		return false;
	};

	Ep = (v: number[], s:string[]) => {
		let tok: number;
		let v1: number[] = [];
		let s1: string[] = [];
		tok = this.lexico.getToken();
		if (tok !== undefined && (tok === Token.MAS || tok === Token.MENOS)) {
			if (this.T(v1, s1)) {
				v[0] += tok === Token.MAS ? v1[0] : -v1[0];
				s[0] = `${tok === Token.MAS ? "+" : "-"} ${s[0]} ${s1[0]}`;
				if (this.Ep(v,s)) {
					return true;
				}
			}
			return false;
		}
		if (tok !== undefined) this.lexico.returnToken();
		return true;
	};

	T = (v: number[], s:string[]) => {
		if (this.P(v,s)) {
			if (this.Tp(v,s)) return true;
		}
		return false;
	};

	Tp = (v: number[], s:string[]) => {
		let tok: number;
		let v1: number[] = [];
		let s1: string[] = [];
		tok = this.lexico.getToken();
		if (tok !== undefined && (tok === Token.PROD || tok === Token.DIV)) {
			if (this.P(v1, s1)) {
				v[0] *= tok === Token.PROD ? v1[0] : 1.0 / v1[0];
				s[0] = `${tok === Token.PROD ? "*" : "/"} ${s[0]} ${s1[0]}`;
				if (this.Tp(v,s)) return true;
			}
			return false;
		}
		if (tok !== undefined) this.lexico.returnToken();
		return true;
	};

	P = (v: number[], s:string[]) => {
		if (this.F(v,s)) {
			if (this.Pp(v,s)) return true;
		}
		return false;
	};

	Pp = (v: number[], s:string[]) => {
		let tok: number;
		let v1: number[] = [];
		let s1: string[] = [];
		tok = this.lexico.getToken();

		if (tok !== undefined && tok === Token.POT) {
			if (this.F(v1, s1)) {
				v[0] = Math.pow(v[0], v1[0]);
				s[0] = `^ ${s[0]} ${s[1]}`;
				if (this.Pp(v,s)) {
					return true;
				}
			}
			return false;
		}
		if (tok !== undefined) this.lexico.returnToken();
		return true;
	};

	F = (v: number[], s:string[]) => {
		let tok: number = this.lexico.getToken();

		switch (tok) {
			case Token.PAR_I:
				if (this.E(v,s)) {
					tok = this.lexico.getToken();
					if (tok === Token.PAR_D) {
						return true;
					}
				}
				return false;

			case Token.SIN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.sin(v[0]);
							s[0] = "sin " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.COS:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.cos(v[0]);
							s[0] = "cos " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.TAN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.tan(v[0]);
							s[0] = "tan " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.EXP:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.exp(v[0]);
							s[0] = "exp " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.LN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.log(v[0]);
							s[0] = "ln " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.LOG:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v,s)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.log10(v[0]);
							s[0] = "log " + s[0];
							return true;
						}
					}
				}
				return false;

			case Token.NUM:
				const lexem = this.lexico.getCurrentLexem();
				v[0] = +lexem;
				s[0] = lexem;
				return true;
			default:
				return false;
		}
	};
}
export { SyntaxAnalyzerCalc };
