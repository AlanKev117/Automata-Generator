import React from "react";
import classes from "./ParserTable.module.css";
import { LR1 } from "../../../../../ts/Grammar/LR1/LR1";
import { LL1 } from "../../../../../ts/Grammar/LL1/LL1";
import { LR0 } from "../../../../../ts/Grammar/LR0/LR0";

const parserTable = props => {
    const grammar = props.parser.G;
    if (props.parser instanceof LR1) {
        return (
            <table className={classes.ParserTable}>
                <thead>
                    <tr>
                        <th
                            colSpan={
                                grammar.terminals.size +
                                grammar.nonTerminals.size +
                                2
                            }
                        >
                            Tabla LR1 de la Gramática
                        </th>
                    </tr>
                    <tr>
                        <th>Estado</th>
                        {[...grammar.terminals].map(t => (
                            <th key={t}>{t}</th>
                        ))}
                        <th>$</th>
                        {[...grammar.nonTerminals].map(nt => (
                            <th key={nt}>{nt}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {props.parser.LR1Table.map((row, i) => {
                        let pesosOpClass = "";
                        let pesosOp = " ";
                        if (row["$"]) {
                            pesosOp = row["$"];
                            if (row["$"] === "r0") {
                                pesosOpClass = classes.accept;
                                pesosOp = "acc";
                            } else if (row["$"][0] === "s") {
                                pesosOpClass = classes.shift;
                            } else if (row["$"][0] === "r") {
                                pesosOpClass = classes.reduce;
                            }
                        }
                        return (
                            <tr key={i}>
                                <td>{i}</td>
                                {[...grammar.terminals].map(t => {
                                    let opClass = "";
                                    let op = " ";
                                    if (row[t]) {
                                        op = row[t];
                                        if (row[t] === "r0") {
                                            op = "acc";
                                            opClass = classes.accept;
                                        } else if (row[t][0] === "s") {
                                            opClass = classes.shift;
                                        } else if (row[t][0] === "r") {
                                            opClass = classes.reduce;
                                        }
                                    }
                                    return (
                                        <td
                                            className={opClass}
                                            key={i + " " + t}
                                        >
                                            {op}
                                        </td>
                                    );
                                })}
                                <td className={pesosOpClass}>{pesosOp}</td>
                                {[...grammar.nonTerminals].map(nt => (
                                    <td key={i + " " + nt}>
                                        {row[nt] ? row[nt] : " "}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    } else if (props.parser instanceof LL1) {
        return (
            <table className={classes.ParserTable}>
                <thead>
                    <tr>
                        <th colSpan={grammar.terminals.size + 2}>
                            Tabla LL1 de la Gramática
                        </th>
                    </tr>
                    <tr>
                        <th> </th>
                        {[...grammar.terminals].map(t => (
                            <th key={"head-" + t}>{t}</th>
                        ))}
                        <th>$</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(props.parser.LL1Table).map(nt => {
                        return (
                            <tr key={`row-${nt}`}>
                                <td>{nt}</td>
                                {[...grammar.terminals].concat("$").map(t => {
                                    const square = props.parser.LL1Table[nt][t];
                                    return (
                                        <td key={`square-${nt}-${t}`}>
                                            {square
                                                ? `${square[0].toString()}, ${square[1]}`
                                                : " "}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    } else if (props.parser instanceof LR0) {
        return (
            <table className={classes.ParserTable}>
                <thead>
                    <tr>
                        <th
                            colSpan={
                                grammar.terminals.size +
                                grammar.nonTerminals.size +
                                2
                            }
                        >
                            Tabla LR0 de la Gramática
                        </th>
                    </tr>
                    <tr>
                        <th>Estado</th>
                        {[...grammar.terminals].map(t => (
                            <th key={t}>{t}</th>
                        ))}
                        <th>$</th>
                        {[...grammar.nonTerminals].map(nt => (
                            <th key={nt}>{nt}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {props.parser.LR0Table.map((row, i) => {
                        let pesosOpClass = "";
                        let pesosOp = " ";
                        if (row["$"]) {
                            pesosOp = row["$"];
                            if (row["$"] === "r0") {
                                pesosOpClass = classes.accept;
                                pesosOp = "acc";
                            } else if (row["$"][0] === "s") {
                                pesosOpClass = classes.shift;
                            } else if (row["$"][0] === "r") {
                                pesosOpClass = classes.reduce;
                            }
                        }
                        return (
                            <tr key={i}>
                                <td>{i}</td>
                                {[...grammar.terminals].map(t => {
                                    let opClass = "";
                                    let op = " ";
                                    if (row[t]) {
                                        op = row[t];
                                        if (row[t] === "r0") {
                                            op = "acc";
                                            opClass = classes.accept;
                                        } else if (row[t][0] === "s") {
                                            opClass = classes.shift;
                                        } else if (row[t][0] === "r") {
                                            opClass = classes.reduce;
                                        }
                                    }
                                    return (
                                        <td
                                            className={opClass}
                                            key={i + " " + t}
                                        >
                                            {op}
                                        </td>
                                    );
                                })}
                                <td className={pesosOpClass}>{pesosOp}</td>
                                {[...grammar.nonTerminals].map(nt => (
                                    <td key={i + " " + nt}>
                                        {row[nt] && nt !== grammar.startSymbol
                                            ? row[nt]
                                            : " "}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
};

export default parserTable;
