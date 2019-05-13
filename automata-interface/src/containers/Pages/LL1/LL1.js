import React, { Component } from "react";
import classes from "./LL1.module.css";
import { SyntaxAnalyzerGrammar } from "../../../ts/LL1/SyntaxAnalyzerGrammar";
import GrammarInput from "./GrammarInput/GrammarInput";
import { LL1ts } from "../../../ts/LL1/LL1";

class LL1 extends Component {
    state = {
        grammars: [],
        grammarText: ""
    };

    createGrammar = () => {
        const analyzer = new SyntaxAnalyzerGrammar(this.state.grammarText);
        let grammar = null;
        if ((grammar = analyzer.solve("Gramática Chida")) != null) {
            this.setState({grammars: [grammar]});
            console.log(grammar);
            const ll1 = new LL1ts(grammar);
            console.log(ll1.createLL1Table());
            ll1.createLL1Table();
        } else {
            alert("Error sintáctico al obtener gramática.");
        }
    };

    grammarTextChanged = event => {
        this.setState({ grammarText: event.target.value });
    };

    render() {
        return (
            <main className={classes.LL1}>
                <h1>Creador de autómatas por expresión regular</h1>
                <GrammarInput
                    grammarText={this.state.grammarText}
                    grammarTextChanged={this.grammarTextChanged}
                    createGrammar={this.createGrammar}
                />
                {this.state.grammars.length > 0 ? (
                    <div style={{ textAlign: "center" }}>
                        {this.state.grammars[0].toString()}
                    </div>
                ) : null}
            </main>
        );
    }
}

export default LL1;
