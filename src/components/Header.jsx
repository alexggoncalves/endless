import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import burgeropen from "./../assets/menu-open.gif";
import burgerclose from "./../assets/menu-close.gif";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

const PageIndicator = () => {
    return <div className="page-indicator"></div>;
};

const Header = () => {
    const [burgerOpened, setBurgerOpened] = useState(false);
    const navRef = useRef();
    let openMenuAnimation = useRef();

    useGSAP(() => {
        openMenuAnimation.current = gsap
            .timeline({ paused: true })
            .to(navRef.current, {
                width: "35vw",
                duration: 0.3,
                ease: "power2",
            })
            .fromTo(
                ".links a",
                {
                    opacity: 0,
                },
                { opacity: 1, duration: 0.3, stagger:{each:0.05,from: "end"}},
                "<"
            );
    });

    const openMenu = () => {
        setBurgerOpened(true);
        openMenuAnimation.current?.play();
    };

    const closeMenu = () => {
        setBurgerOpened(false);

        openMenuAnimation.current?.reverse();
    };

    return (
        <header>
            <Link className="logo" to={"/"}>
                endless
            </Link>

            <nav ref={navRef}>
                <div className={`links ${!burgerOpened ? "navClosed" : ""}`}>
                    <Link to={"/"} onClick={closeMenu}>
                        EXPLORER
                    </Link>

                    <Link to={"/archive"} onClick={closeMenu}>
                        ARCHIVE
                    </Link>

                    <Link to={"/about"} onClick={closeMenu}>
                        ABOUT US
                    </Link>

                    <Link to={"/suggest"} onClick={closeMenu}>
                        SUGGEST A SONG
                    </Link>
                </div>

                {burgerOpened ? (
                    <img
                        src={burgeropen}
                        className="burger"
                        onClick={closeMenu}
                    />
                ) : (
                    <img
                        src={burgerclose}
                        className="burger"
                        onClick={openMenu}
                    />
                )}
            </nav>
        </header>
    );
};

export default Header;
