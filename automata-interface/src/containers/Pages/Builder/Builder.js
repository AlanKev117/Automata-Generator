import React, { Component } from "react";
import Creator from "./Creator/Creator";
import Chooser from "./Chooser/Chooser";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";
import Table from "./Table/Table";

import classes from "./Builder.module.css";
import { Automaton } from "../../../ts/Automaton/Automaton";
//import { Automaton } from "../../../ts/Automaton/Automaton";

class Builder extends Component {
    state = {
        //automata: this.props.automata,
        name: "",
        symbol: "",
        automaton1: "",
        automaton2: "",
        operation: "",
        showA2: false
    };

    nameChangedHandler = event => {
        this.setState({
            name: event.target.value
        });
    };

    symbolChangedHandler = event => {
        this.setState({
            symbol: event.target.value
        });
    };

    automaton1ChangedHandler = event => {
        this.setState({
            automaton1: event.target.value
        });
    };

    automaton2ChangedHandler = event => {
        this.setState({
            automaton2: event.target.value
        });
    };

    operationChangedHandler = event => {
        const operation = event.target.value;
        const showA2 = operation === "concatenarAFN" || operation === "unirAFN";
        const automaton2 = showA2 ? this.props.automata[0].getName() : "";
        this.setState({
            operation: operation,
            showA2: showA2,
            automaton2: automaton2
        });
    };

    createAutomatonHandler = () => {
        if (this.state.length === 0) {
            alert("Ingrese un nombre para el autómata.");
            return;
        } else if (
            this.props.automata.find(
                a => a.name.toLowerCase() === this.state.name.toLowerCase()
            )
        ) {
            alert("Ese nombre de autómata no está disponible.");
            return;
        }

        if (this.state.symbol.length === 0) {
            alert("Ingrese un símbolo/rango de transición.");
            return;
        }
        const range = this.state.symbol.split("-");
        const name = this.state.name;
        const newAutom = new Automaton(name);
        switch (range.length) {
            case 1:
                newAutom.createBasic(range[0]);
                break;
            case 2:
                newAutom.createBasic(range[0], range[1]);
                break;
            default:
                alert("Rango de transición no válido.");
                return;
        }
        this.props.automata.push(newAutom);
        this.setState({
            name: "",
            symbol: "",
            automaton1: name
        });
    };

    unaryOperationHandler = () => {
        const automaton = this.props.automata.find(
            a => a.getName() === this.state.automaton1
        );

        automaton[this.state.operation]();

        this.setState({ automaton1: automaton.getName() });
    };

    binaryOperationHandler = () => {
        const a1 = this.props.automata.find(
            a => a.getName() === this.state.automaton1
        );

        const a2 = this.props.automata.find(
            a => a.getName() === this.state.automaton2
        );

        a1[this.state.operation](a2.copy());

        this.setState({ automaton1: a1.getName() });
    };

    componentDidMount = () => {
        if (this.props.automata.length > 0) {
            this.setState({
                automaton1: this.props.automata[0].getName()
            });
        }
    };

    render() {
        const classesBtn = classes.BuilderBtn;
        return (
            <main className={classes.Builder}>
                <h1>Constructor de autómatas</h1>

                {/*Creador de autómatas simples*/}
                <div style={{ textAlign: "center" }}>
                    <Creator
                        name={this.state.name}
                        symbol={this.state.symbol}
                        automataCreated={this.createAutomatonHandler}
                        nameChanged={this.nameChangedHandler}
                        symbolChanged={this.symbolChangedHandler}
                    />
                </div>

                {/*Si existen autómatas en el props, 
                se muestra un selector*/}
                {this.props.automata.length > 0 ? (
                    <Auxiliary>
                        <Chooser
                            text="Escoge autómata"
                            changed={this.automaton1ChangedHandler}
                            values={this.props.automata.map(automaton =>
                                automaton.getName()
                            )}
                            defValue={this.state.automaton1}
                        />
                        <Chooser
                            text="Operación"
                            changed={this.operationChangedHandler}
                            values={[
                                "makeOptional",
                                "makePositive",
                                "makeKleene",
                                "makeAFD",
                                "unirAFN",
                                "concatenarAFN"
                            ]}
                            options={[
                                "Hacer opcional",
                                "Hacer positivo",
                                "Hacer Kleene",
                                "Hacer AFD",
                                "Unir",
                                "Concatenar"
                            ]}
                        />
                        {this.state.showA2 ? null : (
                            <button
                                className={classesBtn}
                                onClick={this.unaryOperationHandler}
                            >
                                Ejecutar
                            </button>
                        )}
                    </Auxiliary>
                ) : null}

                {/*Se selecciona segundo autómata 
                si se selecciona la operación
                correcta*/}
                {this.state.showA2 ? (
                    <Auxiliary>
                        <Chooser
                            text="Con"
                            changed={this.automaton2ChangedHandler}
                            values={this.props.automata.map(automaton =>
                                automaton.getName()
                            )}
                        />
                        <button
                            className={classesBtn}
                            onClick={this.binaryOperationHandler}
                        >
                            Ejecutar
                        </button>
                    </Auxiliary>
                ) : null}

                {/*Se muestra tabla del autómata seleccionado 
                en la primer caja*/}
                <div style={{ textAlign: "center" }}>
                    {this.state.automaton1.length > 0 ? (
                        <Table
                            automaton={this.props.automata.find(
                                automaton =>
                                    automaton.getName() ===
                                    this.state.automaton1
                            )}
                        />
                    ) : null}
                </div>
            </main>
        );
    }
}

export default Builder;