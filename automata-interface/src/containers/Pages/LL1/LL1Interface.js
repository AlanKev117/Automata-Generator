import React, { Component } from "react";
import classes from "./LL1Interface.module.css";
import { SyntaxAnalyzerGrammar } from "../../../ts/Grammar/SyntaxAnalyzerGrammar";
import { LexicAnalyzer } from "../../../ts/LexicAnalyzer/LexicAnalyzer";
import Misc from "../../../ts/Misc/Misc";
import GrammarInput from "./GrammarInput/GrammarInput";
import { LL1 } from "../../../ts/Grammar/LL1/LL1";

class LL1Interface extends Component {
    constructor(){
        super();
        this.textArea = React.createRef()
        this.epsilon = Misc.SAFE_EPSILON;
        this.symbol='';
        this.ll1Table = {};
        this.lexicAnalyzer = null;
        this.analyzer = null;
    }
    state = {
        grammars: [],
        grammarText: "",
        grammarStringText: ""
    };
    
    createGrammar = () => {
        alert(this.state.grammarText);
        const analyzer = new SyntaxAnalyzerGrammar(this.state.grammarText);
        this.analyzer = analyzer;
        let grammar = analyzer.solve("Gramática Chida");
        if (grammar !== null) {
            this.setState({ grammars: [grammar] });
            this.ll1Table = new LL1(grammar);
			console.log("Tabla LL1: " + this.ll1Table);
            console.log(grammar);
        } else {
            alert("Error sintáctico al obtener gramática.");
        }
    };

    analyzeString = () => {
        //alert(this.state.grammarStringText);
        (this.ll1Table.analyzeString(this.state.grammarStringText))?alert("true"):alert("false");
    }

    grammarStringChanged = event => {
        this.setState({ grammarStringText: event.target.value });
    }

    grammarTextChanged = (event) => {
        this.setState({ grammarText: event.target.value });

    };

    addEpsilon = () => {
        this.textArea.current.value = this.textArea.current.value + this.epsilon;   
        this.setState({ grammarText: this.textArea.current.value });
        document.getElementById("textAreaLL1").focus();  
        
    }

    addPipeline = () => {
        this.textArea.current.value = this.textArea.current.value + "|";
        this.setState({ grammarText: this.textArea.current.value });
        document.getElementById("textAreaLL1").focus();  
    }

    addArrow = () => {
        this.textArea.current.value = this.textArea.current.value + "->";
        this.setState({ grammarText: this.textArea.current.value });
        document.getElementById("textAreaLL1").focus();  
    }

    addFinal = () => {
        this.textArea.current.value = this.textArea.current.value + ";";
        this.setState({ grammarText: this.textArea.current.value });
        document.getElementById("textAreaLL1").focus();  
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
                    addPipeline={this.addPipeline}
                    addArrow={this.addArrow}
                    addFinal={this.addFinal}
                    textArea={this.textArea}
                    symbol={this.symbol}

                />
                <div>
                <br/><br/>
                    <center>
                    <button onClick={this.createGrammar}>
                        <strong>Crear gramática</strong>
                    </button>
                    </center>
                </div>
                {this.state.grammars.length > 0 ? (
                    <div>
                    <div style={{ textAlign: "center", margin: "6px" }}>
                        Gramática generada en consola.
                    </div>
                    <br/><br/>
                    <h2><center>Analizador de cadenas</center></h2><br/>
                    <div className={classes.box}>
                        <h3>Introduzca cadena:</h3><input type="text" name="stringLL1" onChange={this.grammarStringChanged}/>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={this.analyzeString}>
                            Analizar
                        </button>
                    </div>
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
