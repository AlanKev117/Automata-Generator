import React from "react";
import classes from "./Evaluator.module.css";

const evaluator = props => {
	const content = props.analyzers.map((value, i) => {
		return (
			<option key={i} value={value}>
				{props.options ? props.options[i] : value}
			</option>
		);
	});
	return (
		<div className={classes.Evaluator}>
			<label>{props.text}</label>
			<select onChange={props.analyzerChanged} value={props.current}>
				{content}
			</select>
			<input
				type="text"
				placeholder="Cadena a analizar"
				value={props.inputString}
				onChange={props.inputStringChanged}
			/>
			<button onClick={props.analyze}>Analizar</button>
		</div>
	);
};

export default evaluator;
