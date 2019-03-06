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
	R_SIMBm,
	R_SIMM,
	r_NUM,
	
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
			const autoGuion = new Automaton("-");
			autoGuion.createBasic("-");
			const autoCIZQ = new Automaton("]");
			autoCIZQ.createBasic("]");
			const autoDIAG = new Automaton("\");
			autoDIAG.createBasic("\");

            // Creamos los autómatas que nos servirán para hacer en analizador léxico
			const autoOR = new Automaton("MAS");
			autoOR.createBasic("|");
			const autoCONC = new Automaton("MENOS");
			autoCONC.createBasic("-");
			const autoPROD = new Automaton("PROD");
			autoPROD.createBasic("*");
			const autoCERR_POS = new Automaton("DIV");
			autoCERR_POS.createBasic("/");
			const autoCERR_KLEEN = new Automaton("POT");
			autoCERR_KLEEN.createBasic("^");
			const autoPAR_I = new Automaton("PAR_I");
			autoPAR_I.createBasic("(");
			const autoPAR_D = new Automaton("PAR_D");
			autoPAR_D.createBasic(")");
			//automata para rango de simbolos minusculos
			const autoR_SIMBm = new Automaton("autoR_SIMBm")
			autoR_SIMBm.createBasic("[");

			//automata para rango de simbolos MAyusculos
			const autoR_SIMM = new Automaton("autoR_SIMM")			
			autoR_SIMM.createBasic("[");
			autoR_SIMM.concatenarAFN(autoCIZQ.copy());
			autoR_SIMM.concatenarAFN(autoCIZQ.copy());
			//automata para rango de simbolos numericos
			const autoR_NUM = new Automaton("autor_NUM")
			autoR_NUM.createBasic("[");
			autoR_NUM.concatenarAFN(autoDIAG.copy());
			autoR_NUM.concatenarAFN(autoDIAG.copy());
 
			return [
    
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

            case Token.SIMB:
            
                
				f.createBasic(this.lexico.getCurrentLexem()[0])
				return true;
        }
        return false;
    };
    





}
export { SyntaxAnalyzerAFN };
