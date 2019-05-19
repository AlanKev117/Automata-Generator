import React, { Component } from "react";
import classes from "./Grammar.module.css";
import { SyntaxAnalyzerGrammar } from "../../../ts/Grammar/SyntaxAnalyzerGrammar";
import GrammarInput from "./GrammarInput/GrammarInput";
import GrammarOutput from "./GrammarOutput/GrammarOutput";
import Misc from "../../../ts/Misc/Misc";

class Grammar extends Component {

	state = {
		grammar: null,
		grammarText: ""
	};

	createGrammar = () => {
		const analyzer = new SyntaxAnalyzerGrammar(this.state.grammarText);
		let newGrammar = analyzer.solve("Gramática");
		if (newGrammar !== null) {
			this.setState({ grammar: newGrammar });
		} else {
			alert("Error sintáctico al obtener gramática.");
		}
	};

	grammarTextChanged = event => {
		this.setState({ grammarText: event.target.value });
	};

	addEpsilon = () => {
		this.setState(prevState => {
			prevState.grammarText += Misc.SAFE_EPSILON;
			return prevState;
		});
	};

	render() {
		return (
			<main className={classes.Grammar}>
				<h1>Creador de gramáticas</h1>
				<GrammarInput
					grammarText={this.state.grammarText}
					grammarTextChanged={this.grammarTextChanged}
					createGrammar={this.createGrammar}
					addEpsilon={this.addEpsilon}
					textArea={this.textArea}
				/>
				<div style={{ textAlign: "center", margin: "30px" }}>
					{this.state.grammar ? (
						<GrammarOutput grammar={this.state.grammar} />
					) : null}
				</div>
			</main>
		);
	}
}

export default Grammar;
