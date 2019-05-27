import React, { useState } from "react";
import classes from "./GrammarOutput.module.css";
import { LR1 } from "../../../../ts/Grammar/LR1/LR1";
import { LR0 } from "../../../../ts/Grammar/LR0/LR0";
import { LL1 } from "../../../../ts/Grammar/LL1/LL1";
import ParserTable from "./ParserTable/ParserTable";
import StepsViewer from "./StepsViewer/StepsViewer";

const grammarOutput = props => {
    // Se recibe una gramática en props.grammar
    const grammar = props.grammar;

    // Arreglo muy usado: [...grammar.terminals]
    const terminals = [...grammar.terminals];

    // Se usa un state para el parser (del tipo que sea.)
    const [parserState, setParserState] = useState(null);

    // Se usa un estado para mostrar los pasos del resultado de análisis.
    const [showSteps, setShowSteps] = useState(false);

    // Se usa una variable para el arreglo de tokens
    const tokens = terminals.map((t, i) => i + 1);

    // Se usa un state para el arreglo de expresiones regulares.
    const [regExpsState, setRegExpsState] = useState([...terminals]);
    // Se declaran funciones para actualizar las expresiones regulares.
    const regExpsHandlers = terminals.map((t, i) => {
        return event => {
            const copy = [...regExpsState];
            copy[i] = event.target.value;
            console.log("actualizado regex " + i);
            setRegExpsState(copy);
        };
    });

    // Se usa un estado para la entrada de la cadena a evaluar.
    const [textInput, setTextInput] = useState("");
    let grammarTextChangedHandler = event => {
        setTextInput(event.target.value);
    };

    /**
     * // Obtiene un arreglo con las reglas de la gramática de las props.
     *
     * @param {Node} rules
     * @returns {{leftSide: any; rightSide: string;}[]}
     */
    const mapRulesToArray = rules => {
        const arr = [];
        for (let leftSide = rules; leftSide != null; leftSide = leftSide.down) {
            for (let rule = leftSide.right; rule != null; rule = rule.down) {
                // Convertimos el lado derecho en una cadena.
                let str = "";
                for (let aux = rule; aux !== null; aux = aux.right) {
                    str += aux.symbol;
                }
                // Agregamos una regla al conjunto indexado.
                arr.push({
                    leftSide: leftSide.symbol,
                    rightSide: str
                });
            }
        }
        return arr;
    };

    /**
     * Establece en parserState un parser LR1
     *
     */
    const createLR1Parser = () => {
        const newParser = new LR1(props.grammar);
        console.log(newParser);
        setParserState(newParser);
    };

    const createLR0Parser = () => {
        const newParser = new LR0(props.grammar);
        console.log(newParser);
        setParserState(newParser);
    };

    const createLL1Parser = () => {
        const newParser = new LL1(props.grammar);
        console.log(newParser);
        setParserState(newParser);
    };

    const analyzeString = () => {
        const valid = parserState.evaluate(textInput, tokens, regExpsState);
        if (valid) {
            setShowSteps(true);
        } else {
            alert("Cadena no válida.");
        }
    };

    // Arreglo de reglas para mostrar en render (return).
    const grammarRules = mapRulesToArray(grammar.rules);

    return (
        <div className={classes.GrammarOutput}>
            <h1>Producciones:</h1>
            {// Pasamos las reglas a HTML
            grammarRules.map(rule => {
                return (
                    <div
                        key={JSON.stringify(rule)}
                        className={classes.Rule}
                    >{`${rule.leftSide}${String.fromCharCode(0x2192)}${
                        rule.rightSide
                    }`}</div>
                );
            })}
            <button onClick={createLL1Parser}>Crear Tabla LL(1)</button>
            <button onClick={createLR0Parser}>Crear Tabla LR(0)</button>
            <button onClick={createLR1Parser}>Crear Tabla LR(1)</button>
            {parserState ? (
                <div className={classes.TableContainer}>
                    <ParserTable parser={parserState} />
                    <div className={classes.RegExpInputsContainer}>
                        <h2>Expresiones regulares para cada terminal</h2>
                        <h3>
                            Asigne expresiones regulares a los símbolos
                            terminales
                        </h3>
                        {terminals.map((t, i) => (
                            <div
                                key={"input-" + t}
                                className={classes.RegExpInput}
                            >
                                <label>{t}: </label>
                                <input
                                    type="text"
                                    value={regExpsState[i]}
                                    onChange={regExpsHandlers[i]}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={classes.StringInput}>
                        <h2>Analizador de cadenas</h2>
                        <h3>Introduzca cadena:</h3>
                        <div>
                            <input
                                type="text"
                                name="stringLL1"
                                onChange={grammarTextChangedHandler}
                                value={textInput}
                            />
                            <button onClick={analyzeString}>Analizar</button>
                        </div>
                        {showSteps ? (
                            <StepsViewer analysis={parserState.analysis} parser={parserState} />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default grammarOutput;
