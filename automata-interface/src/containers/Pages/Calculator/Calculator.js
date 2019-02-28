import React, { Component } from "react";
import CalcInput from "./CalcInput/CalcInput";

import { SyntaxAnalyzerCalc } from "../../../ts/Calculator/SyntaxAnalyzerCalc";

import classes from "./Calculator.module.css";

class Calculator extends Component {
	state = {
		calcInput: {
			expression: ""
		},

		calcOutput: {}
	};

	calcInputHandlers = {
		expressionChangedHandler: event => {
			this.setState({ calcInput: { expression: event.target.value } });
		},
		analizeExpHandler: () => {
			const expression = this.state.calcInput.expression;
			console.log("Se evaluará: " + expression);
			const an = new SyntaxAnalyzerCalc();
			an.solve(expression);
		}
	};

	render() {
		return (
			<main className={classes.Calculator}>
				<h1>Calculadora</h1>
				<CalcInput
					expression={this.state.calcInput.expression}
					expressionChanged={
						this.calcInputHandlers.expressionChangedHandler
					}
					analizeExp={this.calcInputHandlers.analizeExpHandler}
				/>
			</main>
		);
	}
}

export default Calculator;
