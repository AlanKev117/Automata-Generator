import React, { Component } from "react";
import RegexInput from "./RegexInput/RegexInput";
import Table from "../Builder/Table/Table";

import { SyntaxAnalyzerRegex } from "../../../ts/Regex/SyntaxAnalyzerRegex";

import classes from "./Regex.module.css";

class Regex extends Component {
    state = {
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
            const an = new SyntaxAnalyzerRegex(this.state.regexInput.regex);
            const automaton = an.solve();
            if (automaton !== null) {
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
