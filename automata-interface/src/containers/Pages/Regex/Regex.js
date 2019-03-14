import React, { Component } from "react";
import RegexInput from "./RegexInput/RegexInput";
import Table from "../Builder/Table/Table";
import Misc from "../../../ts/Misc/Misc";

import { SyntaxAnalyzerRegex } from "../../../ts/Regex/SyntaxAnalyzerRegex";

import classes from "./Regex.module.css";

class Regex extends Component {
	state = {
		automata: this.props.automata,

		regexInput: {
			regex: ""
		},

		regexResults: {
			automaton: null
		}
	};

	tableRef = React.createRef();

	regexInputHandlers = {
		regexChangedHandler: event => {
			this.setState({ regexInput: { regex: event.target.value } });
		},
		analyzeRegexHandler: () => {
			const regex = this.state.regexInput.regex;
			const an = new SyntaxAnalyzerRegex(regex);
			const names = this.state.automata.map(auto => auto.getName());
			if (names.indexOf(regex) > -1) {
				return alert("Este autómata ya ha sido creado.");
			}
			const automaton = Misc.afnToAfd(an.solve(regex));
			if (automaton !== null) {
				this.state.automata.push(automaton);
				this.setState({
					regexResults: {
						automaton: automaton
					}
				});
			}
		}
	};

	render() {
		return (
			<main className={classes.Regex}>
				<h1>Creador de autómatas por expresión regular</h1>
				<RegexInput
					regex={this.state.regexInput.regex}
					regexChanged={this.regexInputHandlers.regexChangedHandler}
					analizeRegex={this.regexInputHandlers.analyzeRegexHandler}
				/>
				{this.state.regexResults.automaton != null ? (
					<div style={{ textAlign: "center" }}>
						<Table
							ref={this.tableRef}
							automaton={this.state.regexResults.automaton}
						/>
					</div>
				) : null}
			</main>
		);
	}
}

export default Regex;
