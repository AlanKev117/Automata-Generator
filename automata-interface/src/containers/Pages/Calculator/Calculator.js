import React, { Component } from "react";
import CalcInput from "./CalcInput/CalcInput";
import CalcResults from "./CalcResults/CalcResults";

import { SyntaxAnalyzerCalc } from "../../../ts/Calculator/SyntaxAnalyzerCalc";

import classes from "./Calculator.module.css";

class Calculator extends Component {
	state = {
		calcInput: {
			expression: ""
		},

		calcOutput: {
			value: 0,
			notation: ""
		}
	};

	calcInputHandlers = {
		expressionChangedHandler: event => {
			this.setState({ calcInput: { expression: event.target.value } });
		},
		analizeExpHandler: () => {
			const an = new SyntaxAnalyzerCalc(this.state.calcInput.expression);
			const results = an.solve();
			if (results !== null) {
				this.setState({
					calcOutput: {
						value: results._val,
						notation: results._str
					}
				});
			}
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
				{
					<CalcResults
						value={this.state.calcOutput.value}
						notation={this.state.calcOutput.notation}
					/>
				}
			</main>
		);
	}
}

export default Calculator;
