import React, { Component } from "react";
import domtoimage from "dom-to-image";

import { LexicAnalyzer } from "../../../ts/LexicAnalyzer/LexicAnalyzer";
import Checker from "./Checker/Checker";
import Evaluator from "./Evaluator/Evaluator";
import Table from "../Builder/Table/Table";

import classes from "./Lexic.module.css";

class Lexic extends Component {
	state = {
		// Items externos.
		automata: this.props.automata,
		analyzers: this.props.analyzers,
	
		// Items de Checker
		checkedAutomata: new Set(),
		tokens: {},
		lexicName: "",

		// Items de Chooser
		selectedAnalyzer: "",
		inputString: ""
	};

	tableRef = React.createRef();

	downloadImg = () => {
		domtoimage
			.toPng(this.tableRef.current, {
				style: {
					height: "100vh",
					width: "auto"
				}
			})
			.then(function(dataUrl) {
				var link = document.createElement("a");
				link.download = "analyzer.jpeg";
				link.href = dataUrl;
				link.click();
			});
	};

	// Handlers para los eventos del checker.
	automatonCheckedHandler = event => {
		const name = event.target.name;
		const isChecked = event.target.checked;
		this.setState(prevState => {
			const newCheckedAutomata = prevState.checkedAutomata;
			if (isChecked) {
				newCheckedAutomata.add(name);
			} else {
				newCheckedAutomata.delete(name);
			}
			return { checkedAutomata: newCheckedAutomata };
		});
	};

	tokenChangedHandler = event => {
		const autoName = event.target.name;
		const tokenNumber = event.target.value;
		this.setState(prevState => {
			const tokens = prevState.tokens;
			tokens[autoName] = tokenNumber;
			return { tokens: tokens };
		});
	};

	lexicNameChangedHandler = event => {
		const newName = event.target.value;
		this.setState({
			lexicName: newName
		});
	};

	createLexicAnalyzerHandler = () => {
		// Validación del nombre del analizador léxico.
		if (
			this.props.automata.find(
				automaton => automaton.getName() === this.state.lexicName
			) ||
			this.state.lexicName.length === 0
		) {
			alert("Ingrese otro nombre para el analizador léxico.");
			return;
		}

		// Validación de tokens repetidos o vacíos.
		const count = {};
		let repeated = false;
		let noToken = false;
		for (let key in this.state.tokens) {
			if (!this.state.tokens[key]) {
				noToken = true;
			} else if (!count[this.state.tokens[key]]) {
				count[this.state.tokens[key]] = 1;
			} else {
				repeated = true;
			}
		}
		if (repeated) {
			alert("Algunos tokens están repetidos.");
			return;
		}

		if (noToken) {
			alert("Hay un token sin asignar.");
			return;
		}

		// Se genera el analizador léxico.
		const selectedAutos = this.state.automata
			.filter(automaton =>
				this.state.checkedAutomata.has(automaton.getName())
			)
			.map(selectedAuto => selectedAuto.copy());
		const analyzer = new LexicAnalyzer(
			selectedAutos,
			this.state.tokens,
			this.state.lexicName
		);
		this.setState(prevState => {
			prevState.analyzers.push(analyzer);
			prevState.selectedAnalyzer = prevState.lexicName;
			prevState.lexicName = "";
			return prevState;
		});
	};

	// Handlers para los eventos de Evaluator.
	analyzerSelectedHandler = event => {
		console.log("Seleccionado: " + event.target.value);
		const value = event.target.value;
		this.setState({
			selectedAnalyzer: value
		});
		console.log("Actual: " + this.state.selectedAnalyzer);
	};

	analyzeInputHandler = () => {
		const analyzer = this.state.analyzers.find(
			an => an.getAutomaton().getName() === this.state.selectedAnalyzer
		);

		analyzer.lexicAnalysis(this.state.inputString);
		console.log("Lexemas: " + analyzer.getLexems().map(lex => lex[0]).join(", "));
	};

	inputStringChangedHandler = event => {
		this.setState({inputString: event.target.value});
	}

	// Eventos del ciclo de vida del componente.
	componentDidMount() {
		this.setState(prevState => {
			prevState.automata.forEach((auto, index) => {
				prevState.tokens[auto.getName()] = 10 * (index + 1);
			});
			return prevState;
		});
	}

	componentDidUpdate() {
		// Nos aseguramos de que los tokens de los autómatas estén asignados.
		this.state.automata.forEach((auto, index) => {
			if (!this.state.tokens[auto.getName()]) {
				this.setState(prevState => {
					prevState.tokens[auto.getName()] = 10 * (index + 1);
					return prevState;
				});
			}
		});
	}

	render() {
		return (
			<main className={classes.Lexic}>
				<h1>Analizador Léxico</h1>
				{this.state.automata.length > 0 ? (
					<div style={{ textAlign: "center" }}>
						<Checker
							text="Seleccione autómatas para formar un analizador léxico"
							tokenValues={this.state.tokens}
							autoChecked={this.automatonCheckedHandler}
							tokenChanged={this.tokenChangedHandler}
							automata={this.state.automata}
						/>
						{this.state.checkedAutomata.size > 0 ? (
							<div style={{ textAlign: "center" }}>
								<input
									type="text"
									value={this.state.lexicName}
									onChange={this.lexicNameChangedHandler}
									placeholder="Nombre del analizador"
								/>
								<button
									onClick={this.createLexicAnalyzerHandler}
								>
									Unir para analizador léxico
								</button>
							</div>
						) : null}
					</div>
				) : (
					<h2>No hay autómatas disponibles</h2>
				)}
				{this.state.analyzers.length > 0 ? (
					<div style={{ textAlign: "center" }}>
						<Evaluator
							text="Seleccione analizador y entrada a analizar"
							analyzerChanged={this.analyzerSelectedHandler}
							analyzers={this.state.analyzers.map(a =>
								a.getAutomaton().getName()
							)}
							current={this.state.selectedAnalyzer}
							inputString={this.state.inputString}
							inputStringChanged={this.inputStringChangedHandler}
							analyze={this.analyzeInputHandler}
						/>
						{this.state.selectedAnalyzer ? (
							<div>
								<div>
									<button onClick={this.downloadImg}>
										Descargar
									</button>
								</div>
								<Table
									ref={this.tableRef}
									automaton={this.state.analyzers
										.map(an => an.getAutomaton())
										.find(
											au =>
												au.getName() ===
												this.state.selectedAnalyzer
										)}
								/>
							</div>
						) : null}
					</div>
				) : null}
			</main>
		);
	}
}

export default Lexic;
