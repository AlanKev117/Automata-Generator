import React from "react";

import NavItems from "../NavItems/NavItems";
import classes from "./SideMenu.module.css";

const sideMenu = props => {
    return props.display ? (
        <div className={classes.SideMenu}>
            <NavItems />
        </div>
    ) : null;
};

export default sideMenu;
