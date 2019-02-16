import React from "react";
import Misc from "../../../../ts/Misc/Misc";
//import {Automaton} from "../../../../ts/Automaton/Automaton";

import classes from "./Table.module.css";

const table = props => {
    const automaton = props.automaton;
    const tmpSigma = new Set([...automaton.getSigma(), Misc.EPSILON]);
    // Encabezado de la tabla.
    const head = (
        <thead>
            <tr>
                <th colSpan={`${tmpSigma.size + 1}`} style={{ fontSize: 22 }}>
                    {automaton.getName()}
                </th>
            </tr>
            <tr>
                <th>Estado</th>
                {[...tmpSigma].map(symbol => (
                    <th key={symbol}>{symbol}</th>
                ))}
            </tr>
        </thead>
    );
    // Cuerpo (filas) de la tabla.
    const body = (
        <tbody>
            {[...automaton.states].map(state => {
                // Celda del estado actual.
                const cellClasses = [classes.StateCell];
                if (automaton.startState === state) {
                    cellClasses.push(classes.start);
                } else if (automaton.acceptStates.has(state)) {
                    cellClasses.push(classes.accept);
                }
                const stateCell = (
                    <td className={cellClasses.join(" ")}>
                        <p>{state.getId()}</p>
                    </td>
                );
                // Resto de la fila.
                const targetStatesRow = [];
                for (let symbol of tmpSigma) {
                    const targetStates = state
                        .getTransitionsBySymbol(symbol)
                        .map(
                            transition =>
                                `${transition.getTargetState().getId()}`
                        )
                        .join(", ");
                    const cell = (
                        <td key={`${state},${symbol}`}>
                            {targetStates.length > 0
                                ? `{ ${targetStates} }`
                                : "{ }"}
                        </td>
                    );
                    targetStatesRow.push(cell);
                }
                //Fila completa.
                return (
                    <tr key={"state-" + state.getId()}>
                        {stateCell}
                        {targetStatesRow}
                    </tr>
                );
            })}
        </tbody>
    );
    return (
        <table className={classes.Table}>
            {head}
            {body}
        </table>
    );
};

export default table;
