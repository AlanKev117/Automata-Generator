import React from "react";
import classes from "./GrammarInput.module.css";

const grammarInput = props => {
    return (
        <div className={classes.GrammarInput}>
            <h2>Ingrese reglas de una gramática</h2>
            <h3>Formato: N->aBc|dEf|...;M->xYz|jKl|...</h3>
            <div className={classes.FlexContainer}>
                <textarea
                    name="grammar"
                    value={props.grammarText}
                    onChange={props.grammarTextChanged}
                />
                {props.grammarText.length > 0 ? (
                    <button onClick={props.createGrammar}>
                        Crear gramática
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default grammarInput;
