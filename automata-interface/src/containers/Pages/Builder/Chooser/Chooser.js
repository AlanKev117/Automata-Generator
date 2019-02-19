import React from "react";
import classes from "./Chooser.module.css";

const chooser = props => {
    const content = props.values.map((value, i) => {
        return (
            <option key={i} value={value}>
                {props.options ? props.options[i] : value}
            </option>
        );
    });
    return (
        <div className={classes.Chooser}>
            <label>{props.text}</label>
            <select onChange={props.changed} value={props.defValue}>{content}</select>
        </div>
    );
};

export default chooser;
