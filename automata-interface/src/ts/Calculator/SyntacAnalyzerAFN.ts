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
    SIMB,
}

class SyntaxAnalyzerAFN {
	public lexico: LexicAnalyzer;

	constructor() {
		const tokens = { ...Token };
		const automata = this.createAutomataForLexic();
		this.lexico = new LexicAnalyzer(automata, tokens, "Calculadora AFN");
	}

	private createAutomataForLexic = () => {
    

		
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
