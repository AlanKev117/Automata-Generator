import { LexicAnalyzer } from "../LexicAnalyzer/LexicAnalyzer";
import { Automaton } from "../Automaton/Automaton";

enum Token {
	OR = 1,
	CONC,
	CERR_POS,
	CERR_KLEENE,
	CERR_OPC,
	PAR_I,
	PAR_D,
	SIM
}

class SyntaxAnalyzerRegex {
	public lexico: LexicAnalyzer;

	constructor(input: string) {
		const tokens = { ...Token };
		const automata = this.createAutomataForLexic();
		this.lexico = new LexicAnalyzer(automata, tokens, "Calculadora AFN", input);
	}

	private createAutomataForLexic = () => {
		// Creamos los autómatas que nos servirán para hacer en analizador léxico
		const autoOR = new Automaton("OR"); // 1
		autoOR.createBasic("|");
		const autoCONC = new Automaton("CONC"); // 2
		autoCONC.createBasic("&");
		const autoCERR_POS = new Automaton("CERR_POS"); // 3
		autoCERR_POS.createBasic("+");
		const autoCERR_KLEENE = new Automaton("CERR_KLEENE"); // 4
		autoCERR_KLEENE.createBasic("*");
		const autoCERR_OPC = new Automaton("CERR_OPC"); // 5
		autoCERR_OPC.createBasic("?");
		const autoPAR_I = new Automaton("PAR_I"); // 6
		autoPAR_I.createBasic("(");
		const autoPAR_D = new Automaton("PAR_D"); // 7
		autoPAR_D.createBasic(")");

		// Autómatas AUXILIARES para aceptar un solo dígito o letra.
		const autoDIGIT = new Automaton("DIGIT"); // 8.1
		autoDIGIT.createBasic("0", "9");
		const autoLOWER = new Automaton("LOWER"); // 8.2
		autoLOWER.createBasic("a", "z");
		const autoUPPER = new Automaton("UPPER"); // 8.3
		autoUPPER.createBasic("A", "Z");

		// Autómatas AUXILIARES para los autómatas de los rangos.
		const autoDASH = new Automaton("DASH");
		autoDASH.createBasic("-");
		const autoCLOSE_BR = new Automaton("CLOSE_BR");
		autoCLOSE_BR.createBasic("]");
		const autoUPPER_A = new Automaton("UPPER_A");
		autoUPPER_A.createBasic("A");
		const autoUPPER_Z = new Automaton("UPPER_Z");
		autoUPPER_A.createBasic("Z");
		const autoLOWER_A = new Automaton("LOWER_A");
		autoLOWER_A.createBasic("a");
		const autoLOWER_Z = new Automaton("LOWER_Z");
		autoLOWER_A.createBasic("z");
		const autoNUM_ZERO = new Automaton("NUM_ZERO");
		autoNUM_ZERO.createBasic("0");
		const autoNUM_NINE = new Automaton("NUM_NINE");
		autoNUM_NINE.createBasic("9");

		// Autómatas AUXILIARES de los rangos para SIM.
		const autoDIGIT_RANGE = new Automaton("DIGIT_RANGE"); // 8.4
		autoDIGIT_RANGE.createBasic("[");
		autoDIGIT_RANGE.concatenarAFN(autoNUM_ZERO.copy());
		autoDIGIT_RANGE.concatenarAFN(autoDASH.copy());
		autoDIGIT_RANGE.concatenarAFN(autoNUM_NINE.copy());
		autoDIGIT_RANGE.concatenarAFN(autoCLOSE_BR.copy());
		const autoLOWER_RANGE = new Automaton("LOWER_RANGE"); // 8.5
		autoLOWER_RANGE.createBasic("[");
		autoLOWER_RANGE.concatenarAFN(autoLOWER_A.copy());
		autoLOWER_RANGE.concatenarAFN(autoDASH.copy());
		autoLOWER_RANGE.concatenarAFN(autoLOWER_Z.copy());
		autoLOWER_RANGE.concatenarAFN(autoCLOSE_BR.copy());
		const autoUPPER_RANGE = new Automaton("UPPER_RANGE"); // 8.6
		autoUPPER_RANGE.createBasic("[");
		autoUPPER_RANGE.concatenarAFN(autoUPPER_A.copy());
		autoUPPER_RANGE.concatenarAFN(autoDASH.copy());
		autoUPPER_RANGE.concatenarAFN(autoUPPER_Z.copy());
		autoUPPER_RANGE.concatenarAFN(autoCLOSE_BR.copy());

		// Autómata AUXILIAR para símbolos de operaciones de autómata.
		const autoSHARED = new Automaton("SHARED");
		autoSHARED.createBasic("|");
		autoSHARED.unirAFN(autoCONC.copy());
		autoSHARED.unirAFN(autoCERR_POS.copy());
		autoSHARED.unirAFN(autoCERR_KLEENE.copy());
		autoSHARED.unirAFN(autoCERR_OPC.copy());
		autoSHARED.unirAFN(autoPAR_I.copy());
		autoSHARED.unirAFN(autoPAR_D.copy());

		const autoOTHERS_SHARED = new Automaton("OTHERS_SHARED"); // 8.7
		autoOTHERS_SHARED.createBasic("\\");
		autoOTHERS_SHARED.concatenarAFN(autoSHARED);

		// Autómata AUXILIAR para símbolos no compartidos.
		const autoNOT_SHARED_1 = new Automaton("NS_1");
		autoNOT_SHARED_1.createBasic("!", "/");
		const autoNOT_SHARED_2 = new Automaton("NS_2");
		autoNOT_SHARED_2.createBasic(":", "@");
		const autoNOT_SHARED_3 = new Automaton("NS_3");
		autoNOT_SHARED_3.createBasic("[", "`");
		const autoNOT_SHARED_4 = new Automaton("NS_4");
		autoNOT_SHARED_4.createBasic("{", "¿");

		const autoOTHERS_NOT_SHARED = new Automaton("OTHERS_NOT_SHARED"); // 8.8
		autoOTHERS_NOT_SHARED.createBasic("ñ");
		autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_1.copy());
		autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_2.copy());
		autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_3.copy());
		autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_4.copy());

		// Autómata de SÍMBOLOS
		const autoSIM = new Automaton("SIM");
		autoSIM.createBasic("Ñ");
		autoSIM.unirAFN(autoDIGIT);
		autoSIM.unirAFN(autoLOWER);
		autoSIM.unirAFN(autoUPPER);
		autoSIM.unirAFN(autoDIGIT_RANGE);
		autoSIM.unirAFN(autoLOWER_RANGE);
		autoSIM.unirAFN(autoUPPER_RANGE);
		autoSIM.unirAFN(autoOTHERS_SHARED);
		autoSIM.unirAFN(autoOTHERS_NOT_SHARED);

		return [
			autoOR,
			autoCONC,
			autoCERR_POS,
			autoCERR_KLEENE,
			autoCERR_OPC,
			autoPAR_I,
			autoPAR_D,
			autoSIM
		];
	};

	public solve = () => {
		const val: Automaton = new Automaton("REG-EX");
		if (this.G(val)) {
			return val;
		} else {
			alert("Error sintáctico");
			return null;
		}
	};

	G = (f: Automaton) => {
		let tok: number;
		if (this.E(f)) {
			tok = this.lexico.getToken();
			if (!tok) {
				return true;
			}
		}
		return false;
	};

	E = (f: Automaton) => {
		if (this.T(f)) {
			if (this.Ep(f)) return true;
		}
		return false;
	};

	Ep = (f: Automaton) => {
		let tok: number;
		let f1: Automaton = new Automaton("F1");
		tok = this.lexico.getToken();
		if (tok === Token.OR) {
			if (this.T(f1)) {
				f.unirAFN(f1);
				if (this.Ep(f)) {
					return true;
				}
			}
			return false;
		}
		this.lexico.returnToken();
		return true;
	};

	T = (f: Automaton) => {
		if (this.C(f)) {
			if (this.Cp(f)) return true;
		}
		return false;
	};

	Tp = (f: Automaton) => {
		let tok: number;
		let f1: Automaton = new Automaton("F1");
		tok = this.lexico.getToken();
		if (tok === Token.CONC) {
			if (this.C(f1)) {
				f.concatenarAFN(f1);
				if (this.Tp(f)) return true;
			}
			return false;
		}
		this.lexico.returnToken();
		return true;
	};

	C = (f: Automaton) => {
		if (this.F(f)) {
			if (this.Cp(f)) return true;
		}
		return false;
	};

	Cp = (f: Automaton) => {
		let tok: number = this.lexico.getToken();

		switch (tok) {
			case Token.CERR_KLEENE:
				f.makeKleene();

				if (this.Cp(f)) {
					return true;
				}
				return false;

			case Token.CERR_POS:
				f.makePositive();

				if (this.Cp(f)) {
					return true;
				}
				return false;

			case Token.CERR_OPC:
				f.makeOptional();

				if (this.Cp(f)) {
					return true;
				}
				return false;
		}

		this.lexico.returnToken();
		return true;
	};

	F = (f: Automaton) => {
		let tok: number = this.lexico.getToken();

		switch (tok) {
			case Token.PAR_I:
				if (this.E(f)) {
					tok = this.lexico.getToken();
					if (tok === Token.PAR_D) {
						return true;
					}
				}
				return false;

			case Token.SIM:
				const symbol = this.lexico.getCurrentLexem().split("\\")[0];
				if (symbol.includes("-") && symbol.length === 5) {
					f.createBasic(symbol[1], symbol[3]);
				} else {
					f.createBasic(symbol);
				}
				return true;
		}
		return false;
	};
}
export { SyntaxAnalyzerRegex };
