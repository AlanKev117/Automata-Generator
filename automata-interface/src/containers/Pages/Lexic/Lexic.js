import React, { Component } from "react";
import Misc from "../../../ts/Misc/Misc";
import Checker from "./Checker/Checker";

import classes from "./Lexic.module.css";

class Lexic extends Component {
    state = {
        lexicName: "",
        checkedAutomata: new Set(),
        tokens: {}
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

    tokenChangedHandler = event => {
        const autoName = event.target.name;
        const tokenNumber = event.target.value;
        this.setState(prevState => {
            const tokens = prevState.tokens;
            tokens[autoName] = tokenNumber;
            return { tokens: tokens };
        });
        console.log(this.state.tokens);
    };

    createLexicAnalizerHandler = () => {
        const selectedAutos = this.props.automata
            .filter(automaton =>
                this.state.checkedAutomata.has(automaton.getName())
            )
            .map(selectedAuto => selectedAuto.copy());

        selectedAutos.forEach(auto => {
            auto.setToken(this.state.tokens[auto.getName()]);
        });

        const newAnalizer = Misc.unirAFNAnalisis(
            selectedAutos,
            this.state.lexicName
		);
		console.log(newAnalizer);
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
                            autoChecked={this.automatonCheckedHandler}
                            tokenChanged={this.tokenChangedHandler}
                            automata={this.props.automata}
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
                                    onClick={this.createLexicAnalizerHandler}
                                >
                                    Unir para analizador léxico
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
