import React, { useState } from "react";
import classes from "./GrammarOutput.module.css";
import { LR1 } from "../../../../ts/Grammar/LR1/LR1";
import { LL1 } from "../../../../ts/Grammar/LL1/LL1";
import ParserTable from "./ParserTable/ParserTable";

const grammarOutput = props => {
	/**
	 * // Obtiene un arreglo con las reglas de la gramática de las props.
	 *
	 * @param {Node} rules
	 * @returns {{leftSide: any; rightSide: string;}[]}
	 */

	const [textInput, setTextInput] = useState({
		text: ""
	});
	let grammarTextChanged = event => {
		setTextInput({ text: event.target.value });	
	};
	
	const mapRulesToArray = rules => {
		const arr = [];
		for (let leftSide = rules; leftSide != null; leftSide = leftSide.down) {
			for (let rule = leftSide.right; rule != null; rule = rule.down) {
				// Convertimos el lado derecho en una cadena.
				let str = "";
				for (let aux = rule; aux !== null; aux = aux.right) {
					str += aux.symbol;
				}
				// Agregamos una regla al conjunto indexado.
				arr.push({
					leftSide: leftSide.symbol,
					rightSide: str
				});
			}
		}
		return arr;
	};

	// Se usa un state para el parser (del tipo que sea.)
	const [parserState, setParserState] = useState({
		parser: null,
		type: null
	});

	/**
	 * Establece en parserState un parser LR1
	 *
	 */
	const createLR1Parser = () => {
		const newParser = new LR1(props.grammar);
		setParserState({
			parser: newParser,
			type: "LR1"
		});
	};

	const createLL1Parser = () => {
		const newParser = new LL1(props.grammar);
		console.log(newParser);
		setParserState({
			parser: newParser,
			type: "LL1"
		});
	};

	const analyzeString = () => {
		//alert(textInput.text);
	}

	// Se recibe una gramática en props.grammar
	const rules = props.grammar.rules;

	// Arreglo de reglas para mostrar en render (return).
	const grammarRules = mapRulesToArray(rules);

	return (
		<div className={classes.GrammarOutput}>
			<h1>Producciones:</h1>
			{// Pasamos las reglas a HTML
			grammarRules.map(rule => {
				return (
					<div
						key={JSON.stringify(rule)}
						className={classes.Rule}
					>{`${rule.leftSide}${String.fromCharCode(0x2192)}${
						rule.rightSide
					}`}</div>
				);
			})}
			<button onClick={createLL1Parser}>Crear Tabla LL(1)</button>
			<button>Crear Tabla LR(0)</button>
			<button onClick={createLR1Parser}>Crear Tabla LR(1)</button>
			{parserState.type ? (
				<div style={{ textAlign: "center" }}>
					<ParserTable
						parserType={parserState.type}
						parser={parserState.parser}
					/>
					<div>
						<h2>Analizador de cadenas</h2>
                        <h3>Introduzca cadena:</h3><input type="text" name="stringLL1" onChange={grammarTextChanged}/>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={analyzeString}>
                            Analizar
                        </button>
                    </div>
				</div>
			) : null}
			
		</div>
	);
};

export default grammarOutput;
