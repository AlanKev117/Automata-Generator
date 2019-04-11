import React from "react";
import classes from "./Header.module.css";
import { NavLink } from "react-router-dom";

const header = props => (
    <header className={classes.Header}>
        <div className={classes.Brand}>Automatón</div>
        <nav className={classes.Menu}>
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
                        to="/LL1"
                        activeStyle={{
                            color: "white"
                        }}
                    >
                        LL1
                    </NavLink>
                </li>
            </ul>
        </nav>
    </header>
);

export default header;
