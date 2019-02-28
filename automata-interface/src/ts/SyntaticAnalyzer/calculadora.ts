import { LexicAnalyzer } from "../LexicAnalizer/LexicAnalizer";

enum Token {
	MAS,
	MENOS,
	PROD,
	DIV,
	POR,
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
	public cadena: string;

	constructor(Cadena: string, Lexico: LexicAnalyzer) {
		this.lexico = Lexico;
		this.cadena = Cadena;
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

			default:
				return false;
		}
	};
}
export { Calculadora, Token };
