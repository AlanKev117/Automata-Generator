import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./NavItems.module.css";

const navItems = props => {
    return (
        <nav className={classes.NavItems}>
            <ul>
                <li>
                    <NavLink
                        to="/"
                        exact
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        Constructor
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/lexic"
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        Analizador Léxico
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/calculator"
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        Calculadora
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/regex"
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        RegEx
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/grammar"
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        Grammar
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default navItems;