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
                    <div className={classes.ButtonArea}>
                        <button onClick={props.addEpsilon}>{epsilon}</button>
                        <button onClick={props.addPipeline}>|</button>
                        <button onClick={props.addArrow}>→</button>
                        <button onClick={props.addFinal}>;</button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default grammarInput;
