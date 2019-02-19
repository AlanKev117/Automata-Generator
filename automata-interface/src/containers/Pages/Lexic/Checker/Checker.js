import React from "react";

import classes from "./Checker.module.css";

const checker = props => {
    const checks = props.automata.map(automaton => (
        <div key={automaton.getName()}>
            <label className={classes.container}>
                {automaton.getName()}
                <input
                    type="checkbox"
					name={automaton.getName()}
					onChange={props.autoChecked}
                />
                <span className={classes.checkmark} />
            </label>
            <span>
                <input
                    type="number"
                    onChange={props.tokenChanged}
                    placeholder="Token"
					name={automaton.getName()}
                />
            </span>
        </div>
    ));
    return (
        <div className={classes.Checker}>
            <label>{props.text}</label>
            {checks}
        </div>
    );
};

export default checker;
