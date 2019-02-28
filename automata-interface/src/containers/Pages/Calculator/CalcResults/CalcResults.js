import React from "react";

import classes from "./CalcResults.module.css";

const calcResults = props => (
	<div className={classes.CalcResults}>
		<h3>Resultado</h3>
		<h2>{props.value}</h2>
		<h3>Notación prefija</h3>
		<h2>{props.notation}</h2>
	</div>
);

export default calcResults;
