import React from "react";
import Misc from "../../../../ts/Misc/Misc";

import classes from "./Table.module.css";

const table = (props, ref) => {
	const automaton = props.automaton;
	const tmpSigma = Misc.assertEpsTransitions(automaton)
		? new Set([...automaton.getSigma(), Misc.EPSILON])
		: automaton.getSigma();
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
				if (
					automaton.startState === state &&
					automaton.acceptStates.has(state)
				) {
					cellClasses.push(classes.start);
					cellClasses.push(classes.accept);
				} else if (automaton.acceptStates.has(state)) {
					cellClasses.push(classes.accept);
				} else if (state === automaton.startState) {
					cellClasses.push(classes.start);
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
		<table ref={ref} className={classes.Table}>
			{head}
			{body}
		</table>
	);
};

export default React.forwardRef(table);
