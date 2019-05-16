import React, { Component } from "react";
import classes from "./LL1Interface.module.css";
import { SyntaxAnalyzerGrammar } from "../../../ts/Grammar/SyntaxAnalyzerGrammar";
import GrammarInput from "./GrammarInput/GrammarInput";
//import { LL1 } from "../../../ts/Grammar/LL1/LL1";

class LL1Interface extends Component {
    constructor(){
        super();
        this.textArea = React.createRef()
        this.epsilon = String.fromCharCode(949);
    }
    state = {
        grammars: [],
        grammarText: ""
    };
    
    createGrammar = () => {
        const analyzer = new SyntaxAnalyzerGrammar(this.state.grammarText);
        let grammar = analyzer.solve("Gramática Chida");
        if (grammar !== null) {
            this.setState({ grammars: [grammar] });
            console.log(grammar);
        } else {
            alert("Error sintáctico al obtener gramática.");
        }
    };
    grammarTextChanged = (event) => {
        this.setState({ grammarText: event.target.value });

    };

    addEpsilon = () => {
        this.textArea.current.value = this.textArea.current.value + this.epsilon;       
    }
    render() {
        return (
            <main className={classes.LL1}>
                <h1>Creador de autómatas por expresión regular</h1>
                <GrammarInput
                    grammarText={this.state.grammarText}
                    grammarTextChanged={this.grammarTextChanged}
                    createGrammar={this.createGrammar}
                    addEpsilon={this.addEpsilon}
                    textArea={this.textArea}
                />
                {this.state.grammars.length > 0 ? (
                    <div style={{ textAlign: "center", margin: "6px" }}>
                        Gramática generada en consola.
                    </div>
                ) : (
                    <div style={{ textAlign: "center", margin: "6px" }}>
                        Gramática no generada.
                    </div>
                )}
            </main>
        );
    }
}

export default LL1Interface;
