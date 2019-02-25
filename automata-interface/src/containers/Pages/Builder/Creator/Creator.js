import React from "react";
import classes from "./Creator.module.css";

const creator = props => (
	<div className={classes.Creator}>
		<label>Nuevo autómata simple</label>
		<input
			type="text"
			id="name"
			placeholder="Nombre del autómata"
			onChange={props.nameChanged}
			value={props.name}
		/>
		<input
			type="text"
			id="symbol"
			placeholder="Símbolo/rango"
			onChange={props.symbolChanged}
			value={props.symbol}
			maxLength="3"
		/>
		<button onClick={props.automataCreated}>Crear</button>
	</div>
);

export default creator;
