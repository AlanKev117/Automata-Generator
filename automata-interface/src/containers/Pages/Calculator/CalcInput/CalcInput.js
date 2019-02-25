import React from "react";
import classes from "./CalcInput.module.css";

const calcInput = props => {
	return (
		<div className={classes.CalcInput}>
			<h2>Ingrese una expresión matemática</h2>
			<div className={classes.FlexContainer}>
				<input
					type="text"
					name="expression"
					value={props.expression}
					onChange={props.expressionChanged}
				/>
				<button onClick={props.analizeExp}>Analizar</button>
			</div>
		</div>
	);
};

export default calcInput;