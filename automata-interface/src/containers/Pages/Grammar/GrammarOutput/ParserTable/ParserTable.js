import React from "react";
import classes from "./ParserTable.module.css";

const parserTable = props => {
	const grammar = props.parser.G;
	if (props.parserType === "LR1") {
		return (
			<table className = {classes.ParserTable}>
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
							<th>{t}</th>
						))}
						<th>$</th>
						{[...grammar.nonTerminals].map(nt => (
							<th>{nt}</th>
						))}
					</tr>
				</thead>

				<tbody>
					{props.parser.LR1Table.map((row, i) => {
						return (
							<tr>
								<td>{i}</td>
								{[...grammar.terminals].map(t =>
									row[t] ? <td>{row[t]}</td> : <td> </td>
								)}
								<td>{row["$"] ? row["$"] : " "}</td>
								{[...grammar.nonTerminals].map(nt =>
									row[nt] ? <td>{row[nt]}</td> : <td> </td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
	if (props.parserType === "LL1") {
		return (
			<table className = {classes.ParserTable}>
				<thead>
					<tr>
						<th
							colSpan={
								grammar.terminals.size +
								grammar.nonTerminals.size +
								2
							}
						>
							Tabla LL1 de la Gramática
						</th>
					</tr>
					<tr>
						<th>Estado</th>
						{[...grammar.terminals].map(t => (
							<th>{t}</th>
						))}
						<th>$</th>
						{[...grammar.nonTerminals].map(nt => (
							<th>{nt}</th>
						))}
					</tr>
				</thead>

				<tbody>
					{[...props.parser.LL1Table].map((row, i) => {
						return (
							<tr>
								<td>{i}</td>
								{[...grammar.terminals].map(t =>
									row[t] ? <td>{row[t]}</td> : <td> </td>
								)}
								<td>{row["$"] ? row["$"] : " "}</td>
								{[...grammar.nonTerminals].map(nt =>
									row[nt] ? <td>{row[nt]}</td> : <td> </td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
};

export default parserTable;
