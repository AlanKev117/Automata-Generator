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

class Calculadora {
	public lexico: LexicAnalyzer;

	constructor() {
		const tokens = {...Token};
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
		autoS.createBasic("a");
		const autoX = new Automaton("X");
		autoS.createBasic("x");
		const autoP = new Automaton("P");
		autoS.createBasic("p");
		const autoG = new Automaton("G");
		autoS.createBasic("g");
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
		autoNUM.createBasic("+");
		autoNUM.unirAFN(autoMENOS.copy());
		autoNUM.makeOptional();
		autoNUM.concatenarAFN(autoDIGS);
		autoNUM.concatenarAFN(autoDOT);

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
	}

	G = (v: number[]) => {
		let tok: number;
		if (this.E(v)) {
			tok = this.lexico.getToken();
			if (tok === Token.NUM) return true;
		}
		return false;
	};

	E = (v: number[]) => {
		if (this.T(v)) {
			if (this.Ep(v)) return true;
		}
		return false;
	};

	Ep = (v: number[]) => {
		let tok: number;
		let v1: number[];
		tok = this.lexico.getToken();
		if (tok === Token.MAS || tok === Token.MENOS) {
			if (this.T(v1)) {
				v[0] += tok === Token.MAS ? v1[0] : -v1[0];
				if (this.Ep(v)) {
					return true;
				}
				return false;
			}
		}
		this.lexico.returnToken();
		return true;
	};

	T = (v: number[]) => {
		if (this.P(v)) {
			if (this.Pp(v)) return true;
		}
		return false;
	};

	Tp = (v: number[]) => {
		let tok: number;
		let v1: number[];
		tok = this.lexico.getToken();
		if (tok === Token.PROD || tok === Token.DIV) {
			if (this.P(v1)) {
				v[0] *= tok === Token.PROD ? v1[0] : 1.0 / v1[0];
				if (this.Tp(v)) return true;
				return false;
			}
		}
		this.lexico.returnToken();
		return true;
	};

	P = (v: number[]) => {
		if (this.F(v)) {
			if (this.Pp(v)) return true;
		} else return false;
	};

	Pp = (v: number[]) => {
		let tok: number;
		let v1: number[];
		tok = this.lexico.getToken();

		if (tok === Token.POT) {
			if (this.F(v1)) {
				v[0] = Math.pow(v[0], v1[0]);

				if (this.Pp(v)) {
					return true;
				} else return false;
			}
		}
		this.lexico.returnToken();
		return true;
	};

	F = (v: number[]) => {
		let tok: number = this.lexico.getToken();

		switch (tok) {
			case Token.PAR_I:
				if (this.E(v)) {
					tok = this.lexico.getToken();
					if (tok === Token.PAR_D) {
						return true;
					}
				}
				return false;

			case Token.SIN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.sin(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.COS:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.cos(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.TAN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.tan(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.EXP:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.exp(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.LN:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.log(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.LOG:
				if (this.lexico.getToken() === Token.PAR_I) {
					if (this.E(v)) {
						if (this.lexico.getToken() === Token.PAR_D) {
							v[0] = Math.log10(v[0]);
							return true;
						}
					}
				}
				return false;

			case Token.NUM:
				v[0] = +this.lexico.getCurrentLexem();
				return true;
			default:
				return false;
		}
	};
}
export { Calculadora };
