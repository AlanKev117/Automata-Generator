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
						return (
							<tr key={i}>
								<td>{i}</td>
								{[...grammar.terminals].map(t =>
									<td key={i + " " + t}>{row[t] ? row[t] : " "}</td>
								)}
								<td>{row["$"] ? row["$"] : " "}</td>
								{[...grammar.nonTerminals].map(nt =>
									<td key={i + " " + nt}>{row[nt] ? row[nt] : " "}</td>
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
