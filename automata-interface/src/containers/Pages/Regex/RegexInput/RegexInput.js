import React from "react";
import classes from "./RegexInput.module.css";

const regexInput = props => {
	return (
		<div className={classes.RegexInput}>
			<h2>Ingrese una expresión regular</h2>
			<div className={classes.FlexContainer}>
				<input
					type="text"
					name="regex"
					value={props.regex}
					onChange={props.regexChanged}
				/>
				{props.regex.length > 0 ? (
					<button onClick={props.analizeRegex}>Crear autómata</button>
				) : null}
			</div>
		</div>
	);
};

export default regexInput;
