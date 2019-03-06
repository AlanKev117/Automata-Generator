import { LexicAnalyzer } from "../LexicAnalyzer/LexicAnalyzer";
import { Automaton } from "../Automaton/Automaton";

enum Token {
	OR,
	CONC,
	PROD,
	CERR_POS,
	CERR_KLEEN,
    OPC,
    PAR_I,
	PAR_D,
	SIMBm,
	SIMBM,
	NUM,	
}

class SyntaxAnalyzerAFN {
	public lexico: LexicAnalyzer;

	constructor() {
		const tokens = { ...Token };
		const automata = this.createAutomataForLexic();
		this.lexico = new LexicAnalyzer(automata, tokens, "Calculadora AFN");
	}

	private createAutomataForLexic = () => {
            // Creación de autómatas básicos auxiliares.
			const autoDIGS = new Automaton("DIGS");
			autoDIGS.createBasic("0", "9");
			autoDIGS.makePositive();
			const autoDOT = new Automaton("DOT");
			autoDOT.createBasic(".");
			autoDOT.concatenarAFN(autoDIGS.copy());
			autoDOT.makeOptional();
            // Creamos los autómatas que nos servirán para hacer en analizador léxico
			const autoOR = new Automaton("OR");
			autoOR.createBasic("|");
			const autoCONC = new Automaton("CONC");
			autoCONC.createBasic("&");
			const autoPROD = new Automaton("PROD");
			autoPROD.createBasic("*");
			const autoCERR_POS = new Automaton("CERR_POS");
			autoCERR_POS.createBasic("+");
			const autoOPC = new Automaton("CERR_KLEEN");
			autoOPC.createBasic("*");
			const autoCERR_KLEEN = new Automaton("CERR_KLEEN");
			autoCERR_KLEEN.createBasic("*");
			const autoPAR_I = new Automaton("PAR_I");
			autoPAR_I.createBasic("(");
			const autoPAR_D = new Automaton("PAR_D");
			autoPAR_D.createBasic(")");
			const SIMB = new Automaton("PAR_D");
			SIMB.createBasic(")");

			const autoSIMBm = new Automaton("SIMBm");
			autoSIMBm.createBasic("a", "z");
			autoSIMBm.makePositive();
			const autoSIMBM = new Automaton("SIMNM");
			autoSIMBM.createBasic("A", "Z");
			autoSIMBM.makePositive();
			const autoNUM = new Automaton("NUM");
			autoNUM.createBasic("0", "9");
			autoNUM.makePositive();
			autoNUM.concatenarAFN(autoDOT.copy());
			return [
				autoOR,
				autoCONC,
				autoPROD,
				autoCERR_POS,
				autoCERR_KLEEN,
				autoOPC,
				autoPAR_I,
				autoPAR_D,
				autoSIMBm,
				autoSIMBM,
				autoNUM,

            ];
	};

	public solve = (input: string) => {
		this.lexico.lexicAnalysis(input);
		const val: Automaton;  
		if (this.G(val)) {
			const _val = val;
			return {_val};
		} else {
			alert("Error sintáxtico");
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
		let f1: Automaton;
		tok = this.lexico.getToken();
		if (tok !== undefined && (tok === Token.OR)) {
			if (this.T(f1)) {
				f = f.unirAFN(f1);
				if (this.Ep(f)) {
					return true;
				}
			}
			return false;
		}
		if (tok !== undefined) this.lexico.returnToken();
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
		let f1: Automaton;
		tok = this.lexico.getToken();
		if (tok !== undefined && (tok === Token.CONC)) {
			if (this.C(f1)) {
				f = f.concatenarAFN(f1);
				if (this.Tp(f)) return true;
			}
			return false;
		}
		if (tok !== undefined) this.lexico.returnToken();
		return true;
	};

	C = (f: Automaton) => {
		if (this.F(f)) {
			if (this.Cp(f)) return true;
		}
		return false;
	};

    Cp = (f: Automaton) => {
		let tok: number;
		let f1: Automaton;
		let s1: string;
		tok = this.lexico.getToken();

		switch (tok) {
            case Token.CERR_KLEEN:
                f.makeKleene();

                if (this.Cp(f)) {
                    return true
                }return false;
        
            case Token.CERR_POS:
                f.makePositive();

                if (this.Cp(f)) {
                    return true
                }return false;


            case Token.OPC:
                f.makeOptional();

                if (this.Cp(f)) {
                    return true
                }return false;
        }

        this.lexico.returnToken()
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

            case Token.NUM:
            
				f.createBasic(this.lexico.getCurrentLexem()[0])
				return true;
			
            case Token.SIMBm:
            
				f.createBasic(this.lexico.getCurrentLexem()[0])
				return true;

            case Token.SIMBM:
            
				f.createBasic(this.lexico.getCurrentLexem()[0])
				return true;
        }
        return false;
    };
    





}
export { SyntaxAnalyzerAFN };
