import React from "react";
import classes from "./GrammarInput.module.css";

const grammarInput = props => {
    let epsilon = " " + String.fromCharCode(949) + " ";
    return (
        <div className={classes.GrammarInput}>
            <h2>Ingrese reglas de una gramática</h2>
            <h3>Formato: N->aBc|dEf|...;M->xYz|jKl|...;</h3>
            <div className={classes.FlexContainer}>
                <textarea
                    name="grammar"
                    id="textAreaLL1"
                    ref={props.textArea}
                    value={props.grammarText}
                    onChange={props.grammarTextChanged}
                />
                {props.grammarText.length > 0 ? (
                    <div>

                    <button onClick={props.addEpsilon}>Insertar{epsilon}</button>
                    <br/><br/>
                    <button onClick={props.createGrammar}>
                        <strong>Crear gramática</strong>
                    </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default grammarInput;
