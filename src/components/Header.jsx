import { Link } from "react-router-dom";

import burgeropen from "./../assets/menu-open.gif";
import burgerclose from "./../assets/menu-close.gif";
import { useRef, useState } from "react";

const Header = () => {
    const [burgerOpened, setBurgerOpened] = useState(false);

    const toggleBurgerMenu = () => {
        setBurgerOpened(!burgerOpened)

    }

    return (
        <header className="black-bg white-text">
            <Link className="logo" to={"/endless/"}>
                endless
            </Link>
            {burgerOpened ? (
                <img src={burgeropen} className="burger open" onClick={toggleBurgerMenu}/>
            ) : (
                <img src={burgerclose} className="burger close" onClick={toggleBurgerMenu}/>
            )}

            <nav className={`${!burgerOpened ? "navClosed" : ""}`}>
                <Link to={"/endless"} onClick={toggleBurgerMenu}>EXPLORER</Link>
                <Link to={"/endless/archive"} onClick={toggleBurgerMenu}>ARCHIVE</Link>
                <Link to={"/endless/about"}  onClick={toggleBurgerMenu}>ABOUT US</Link>
                <Link to={"/endless/suggest"}  onClick={toggleBurgerMenu}>SUGGEST A SONG</Link>
            </nav>
        </header>
    );
};

export default Header;
