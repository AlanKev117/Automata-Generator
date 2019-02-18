import React, { Component } from "react";
import Misc from "../../../ts/Misc/Misc";
import Checker from "./Checker/Checker";

import classes from "./Lexic.module.css";

class Lexic extends Component {
	state = {
		lexicName: "",
		checkedAutomata: new Set()
	};

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

	createLexicAnalizerHandler = () => {
		const selectedAutos = this.props.automata
			.filter(automaton =>
				this.state.checkedAutomata.has(automaton.getName())
			)
			.map(selectedAuto => selectedAuto.copy());

		const newAnalizer = Misc.unirAFNAnalisis(
			selectedAutos,
			this.state.lexicName
		);
		this.props.automata.push(newAnalizer);
	};

	lexicNameChangedHandler = event => {
		const newName = event.target.value;
		this.setState({
			lexicName: newName
		});
	};

	render() {
		return (
			<main className={classes.Lexic}>
				<h1>Analizador Léxico</h1>

				{this.props.automata.length > 0 ? (
					<div style={{ textAlign: "center" }}>
						<Checker
							text="Seleccione autómatas para formar el analizador léxico"
							checked={this.automatonCheckedHandler}
							automata={this.props.automata}
						/>
						{this.state.checkedAutomata.size > 0 ? (
							<div style={{ textAlign: "center" }}>
								<input
									type="text"
									value={this.state.lexicName}
									onChange={this.lexicNameChangedHandler}
								/>
								<button
									onClick={this.createLexicAnalizerHandler}
								>
									Crear analizador léxico
								</button>
							</div>
						) : null}
					</div>
				) : (
					<h2>No hay autómatas disponibles</h2>
				)}
			</main>
		);
	}
}

export default Lexic;
