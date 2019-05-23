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
	constructor(){
		super();
		this.textArea = React.createRef();
	}

	createGrammar = () => {
		const analyzer = new SyntaxAnalyzerGrammar(this.state.grammarText);
		let newGrammar = analyzer.solve("Gramática");
		if (newGrammar === null) {
			alert("Error sintáctico en la gramática.");
			return;
		}
		newGrammar.terminals = new Set([...newGrammar.terminals].filter(t => t !== Misc.SAFE_EPSILON));
		if (newGrammar !== null) {
			this.setState({ grammar: newGrammar});
		} else {
			alert("Error sintáctico al obtener gramática.");
		}
	};

	grammarTextChanged = event => {
		this.setState({ grammarText: event.target.value, grammar: null});	
	};

	addEpsilon = () => {
		this.setState(prevState => {
			prevState.grammarText += Misc.SAFE_EPSILON;
			this.textArea.current.focus();
			return prevState;
		});

	};
	addPipeline = () => {
		this.setState(prevState => {
			prevState.grammarText += "|";
			this.textArea.current.focus();
			return prevState;
		});
	};
	addArrow = () => {
		this.setState(prevState => {
			prevState.grammarText += "->";
			this.textArea.current.focus();
			return prevState;
		});
	};
	addFinal = () => {
		this.setState(prevState => {
			prevState.grammarText += ";";
			this.textArea.current.focus();
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
					addPipeline={this.addPipeline}
					addArrow={this.addArrow}
					addFinal={this.addFinal}
					textArea={this.textArea}
				/>
				<br/><br/>
				{this.state.grammarText.length > 0?(<center><button onClick={this.createGrammar}>Crear Gramatica</button></center>):null}
				<div style={{ textAlign: "center", margin: "30px" }}>
					{this.state.grammar ? (
						<GrammarOutput grammar={this.state.grammar}/>
					) : null}
				</div>
			</main>
		);
	}
}

export default Grammar;
