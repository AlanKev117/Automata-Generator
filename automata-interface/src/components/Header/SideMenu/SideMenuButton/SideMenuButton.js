import React from "react";
import classes from "./SideMenuButton.module.css";

const sideMenuButton = props => {
    return (
        <div className={classes.SideMenuButton}>
            <button onClick={props.showMenu}>&equiv;</button>
        </div>
    );
};

export default sideMenuButton;
