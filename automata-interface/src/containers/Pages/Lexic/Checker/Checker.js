import React from "react";

import classes from "./Checker.module.css";

const checker = props => {
	const checks = props.automata.map(automaton => (
		<label key={automaton.getName()} className={classes.container}>
			{automaton.getName()}
			<input type="checkbox" name={automaton.getName()} onChange={props.checked}/>
			<span className={classes.checkmark} />
		</label>
	));
	return (
		<div className={classes.Checker}>
			<label>{props.text}</label>
			{checks}
		</div>
	);
};

export default checker;
