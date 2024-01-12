import { Link, useLocation } from "react-router-dom";

import burgeropen from "./../assets/menu-open.gif";
import burgerclose from "./../assets/menu-close.gif";
import { useState } from "react";

const PageIndicator = () => {
    return <div className="page-indicator"></div>;
};

const Header = () => {
    const [burgerOpened, setBurgerOpened] = useState(false);

    const location = useLocation();

    const toggleBurgerMenu = () => {
        setBurgerOpened(!burgerOpened);
    };

    return (
        <header className="black-bg white-text">
            <Link className="logo" to={"/"}>
                endless
            </Link>
            {burgerOpened ? (
                <img
                    src={burgeropen}
                    className="burger open"
                    onClick={toggleBurgerMenu}
                />
            ) : (
                <img
                    src={burgerclose}
                    className="burger close"
                    onClick={toggleBurgerMenu}
                />
            )}

            <nav className={`${!burgerOpened ? "navClosed" : ""}`}>
                <div>
                    <Link to={"/"} onClick={toggleBurgerMenu}>
                        EXPLORER
                        {!location.pathname?.includes("archive") && !location.pathname?.includes("about") && !location.pathname?.includes("suggest") ? <PageIndicator/>:undefined}
                    </Link>
                    
                </div>
                <div>
                    <Link to={"/archive"} onClick={toggleBurgerMenu}>
                        ARCHIVE
                        {location.pathname?.includes("archive") ? <PageIndicator/>:undefined}
                    </Link>
                </div>
                <div>
                    <Link to={"/about"} onClick={toggleBurgerMenu}>
                        ABOUT US
                        {location.pathname?.includes("about") ? <PageIndicator/>:undefined}
                    </Link>
                </div>
                <div>
                    <Link to={"/suggest"} onClick={toggleBurgerMenu}>
                        SUGGEST A SONG
                        {location.pathname?.includes("suggest") ? <PageIndicator/>:undefined}
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
