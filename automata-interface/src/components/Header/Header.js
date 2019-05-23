import React, {useState} from "react";

import classes from "./Header.module.css";
import NavItems from "../Header/NavItems/NavItems";

import SideMenuButton from "../Header/SideMenu/SideMenuButton/SideMenuButton";
import SideMenu from "../Header/SideMenu/SideMenu";

const header = props => {
    const [displaySideMenu, setDisplaySideMenu] = useState(false);

    const displaySideMenuHandler = () => {
        const display = displaySideMenu;
        setDisplaySideMenu(!display);
    };
    
    return (
    <header className={classes.Header}>
        <div className={classes.Brand}>Automatón</div>
        <div className={classes.DefaultNavItems}>
            <NavItems />
        </div>
        <SideMenuButton showMenu={displaySideMenuHandler}/>
        <SideMenu display={displaySideMenu}/>
    </header>)
};

export default header;
