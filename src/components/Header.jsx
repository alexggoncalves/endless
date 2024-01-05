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
            <Link className="logo" to={""}>
                endless
            </Link>
            {burgerOpened ? (
                <img src={burgeropen} className="burger open" onClick={toggleBurgerMenu}/>
            ) : (
                <img src={burgerclose} className="burger close" onClick={toggleBurgerMenu}/>
            )}

            <nav className={`${!burgerOpened ? "navClosed" : ""}`}>
                <Link to={""} onClick={toggleBurgerMenu}>EXPLORER</Link>
                <Link to={"/archive"} onClick={toggleBurgerMenu}>ARCHIVE</Link>
                <Link to={"/about"}  onClick={toggleBurgerMenu}>ABOUT US</Link>
                <Link to={"/suggest"}  onClick={toggleBurgerMenu}>SUGGEST A SONG</Link>
            </nav>
        </header>
    );
};

export default Header;
