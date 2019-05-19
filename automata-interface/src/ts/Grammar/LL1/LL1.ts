import Misc from "../../Misc/Misc";
import { Gramatica } from "../Gramatica";
import { Node } from "../Node";
import { LexicAnalyzer } from "../../LexicAnalyzer/LexicAnalyzer";
import { Automaton } from "../../Automaton/Automaton";
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
class LL1 {
	private G: Gramatica; //lista de reglas
	private LL1Table: Object[];
	public lexico: LexicAnalyzer;

	constructor(G: Gramatica) {
		this.G = G;
		this.LL1Table = this.createLL1Table();
	}

	private readonly first = (symbols: Array<string>) => {
		//Declaramos conjunto vacio
		let set = new Set<string>();

		// Verificamos si el símbolo recibido es un terminal o épsilon.
		if (this.G.terminals.has(symbols[0]) || symbols[0] === Misc.EPSILON) {
			set.add(symbols[0]);
			return set;
		}

		// Si el símbolo es un no terminal, procedemos de la siguiente forma.
		const rightSides = this.G.getRightSidesWith(symbols[0]);
		for (let rightSide of rightSides) {
			set = new Set<string>(
				[...set].concat(...this.first(rightSide.split("")))
			);
		}

		if (set.has(Misc.EPSILON) && symbols.length != 1) {
			set.delete(Misc.EPSILON);
			symbols.shift();
			set = new Set<string>([...set].concat(...this.first(symbols)));
		}

		return set;
	};

	private readonly follow = (symbol: string) => {
		let set = new Set<string>();
		if (symbol === this.G.startSymbol) {
			set.add("$");
		}
		const gammas = this.G.getLeftSidesAndGammasWith(symbol);
		for (let leftSide in gammas) {
			if (gammas[leftSide].length !== 0) {
				set = new Set<string>(
					[...set].concat(...this.first(gammas[leftSide]))
				);
				if (set.has(Misc.EPSILON)) {
					set.delete(Misc.EPSILON);
					set = new Set<string>(
						[...set].concat(...this.follow(leftSide))
					);
				}
			} else {
				if (leftSide === symbol) {
					return new Set<string>();
				}
				set = new Set<string>(
					[...set].concat(...this.follow(leftSide))
				);
			}
		}

		return set;
	};

	private readonly createLL1Table = () => {
		/* 
			Objeto de objetos (tabla LL1).
			Forma: table[NT o T o $][T o $] = [regla, indice de regla].
		*/
		const table = new Array();

		// Arreglo para indexar reglas.
		const rules: Node[] = [];

		// Iteramos a través de todos los lados izquierdos.
		for (
			let leftSide = this.G.rules;
			leftSide != null;
			leftSide = leftSide.down
		) {
			// Iteramos a través de todas las reglas de esos lados izquierdos.
			for (let rule = leftSide.right; rule != null; rule = rule.down) {
				// Se agrega regla a arreglo para indexar.
				rules.push(rule);

				// Arreglo de todos los símbolos de la regla actual.
				const ruleSymbols = [...this.G.rightSideToString(rule)];

				// Se define nuevo objeto (fila) en caso de no existir.
				if (!table[leftSide.symbol]) {
					table[leftSide.symbol] = {};
				}

				// Obtenemos first de la regla actual.
				const terminals = this.first(ruleSymbols);

				// Si en el resultado se tiene épsilon,
				if (terminals.has(Misc.EPSILON)) {
					// se elimina del conjunto.
					terminals.delete(Misc.EPSILON);

					// Después se calcula el follow.
					const followTerminals = this.follow(leftSide.symbol);

					// El resultado se une con first.
					followTerminals.forEach(terminal => {
						terminals.add(terminal);
					});
				}

				// Ya teniendo los terminales (columnas), se asignan valores a la tabla.
				terminals.forEach(column => {
					table[leftSide.symbol][column] = [
						rule,
						rules.indexOf(rule)
					];
				});
			}
		}
		// Se omiten las operaciones pop en esta implementación, recordando que
		// table[s][s] = stack.pop() ; con s un terminal.
		console.log("TABLA LL1: " + table)
		return table;
};

	public readonly analyzeString = (input: string) => {
		const stack = ["$"];
		const tokens = { ...Token };
        const automata = this.createAutomataForLexic();
        this.lexico = new LexicAnalyzer(
            automata,
            tokens,
           	"Calculadora LL1 input",
            input
		);
		alert("Primer lexema: " + this.lexico.getCurrentLexem());
		//this.LL1Table.le
	}

	public readonly evaluate = (input: string) => {
		const stack = ["$"];
		
	};

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
        autoUPPER_Z.createBasic("Z");
        const autoLOWER_A = new Automaton("LOWER_A");
        autoLOWER_A.createBasic("a");
        const autoLOWER_Z = new Automaton("LOWER_Z");
        autoLOWER_Z.createBasic("z");
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
        autoSHARED.unirAFN(autoDASH.copy());

        const autoOTHERS_SHARED = new Automaton("OTHERS_SHARED"); // 8.7
        autoOTHERS_SHARED.createBasic("\\");
        autoOTHERS_SHARED.concatenarAFN(autoSHARED);

        // Autómata AUXILIAR para símbolos no compartidos.
        const autoNOT_SHARED_1 = new Automaton("NS_1");
        autoNOT_SHARED_1.createBasic(" ", "%");
        const autoNOT_SHARED_2 = new Automaton("NS_2");
        autoNOT_SHARED_2.createBasic(".", "/");
        const autoNOT_SHARED_3 = new Automaton("NS_3");
        autoNOT_SHARED_3.createBasic(":", ">");
        const autoNOT_SHARED_4 = new Automaton("NS_4");
        autoNOT_SHARED_4.createBasic("@");
        const autoNOT_SHARED_5 = new Automaton("NS_5");
        autoNOT_SHARED_5.createBasic("^", "`");
        const autoNOT_SHARED_6 = new Automaton("NS_6");
        autoNOT_SHARED_6.createBasic("~", "¿");
        const autoNOT_SHARED_7 = new Automaton("NS_7");
        autoNOT_SHARED_7.createBasic("'");
        const autoNOT_SHARED_8 = new Automaton("NS_8");
		autoNOT_SHARED_8.createBasic(",");
		const autoNOT_SHARED_9 = new Automaton("NS_9");
		autoNOT_SHARED_9.createBasic(Misc.SAFE_EPSILON);

        const autoOTHERS_NOT_SHARED = new Automaton("OTHERS_NOT_SHARED"); // 8.8
        autoOTHERS_NOT_SHARED.createBasic("ñ");
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_1.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_2.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_3.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_4.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_5.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_6.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_7.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_8.copy());
        autoOTHERS_NOT_SHARED.unirAFN(autoNOT_SHARED_9.copy());

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
}


export { LL1 };
