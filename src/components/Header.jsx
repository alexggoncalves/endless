import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import burgeropen from "./../assets/menu-open.gif";
import burgerclose from "./../assets/menu-close.gif";
import { useContext, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { NavigationContext } from "../contexts/NavigationContext";

const PageIndicator = () => {
    return <div className="page-indicator"></div>;
};

const Header = () => {
    const [burgerOpened, setBurgerOpened] = useState(false);
    const navRef = useRef();
    let openMenuAnimation = useRef();
    const navigate = useNavigate();

    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const { contextSafe } = useGSAP();

    useGSAP(() => {
        openMenuAnimation.current = gsap
            .timeline({ paused: true })
            .to(navRef.current, {
                width: "33vw",
                duration: 0.3,
                ease: "power2",
            })
            .fromTo(
                ".links a",
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.3,
                    stagger: { each: 0.05, from: "end" },
                },
                "<"
            );
    });

    const expandLogo = contextSafe(() => {
        const logo = document.querySelector(".logo");
        gsap.to(logo, {
            duration: 0.15,
            scale: 1.1,
        });
    });
    const shrinkLogo = contextSafe(() => {
        const logo = document.querySelector(".logo");
        gsap.to(logo, {
            duration: 0.15,
            scale: 1,
        });
    });

    const handleLogoClick = contextSafe((e) => {
        const logo = document.querySelector(".logo");
        gsap.fromTo(
            logo,
            {
                scale: 1,
            },
            {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                ease: "power2.inOut",
                onComplete: () => {
                    navigate(`/`,{relative:true});
                },
            }
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

    const logoMouseEnter = () => {
        focusCursor();
        expandLogo();
    };

    const logoMouseLeave = () => {
        unfocusCursor();
        shrinkLogo();
    };

    return (
        <>
            <div
                className="logo"
                onMouseUp={handleLogoClick}
                onMouseEnter={logoMouseEnter}
                onMouseLeave={logoMouseLeave}
            >
                endless
            </div>
            <nav
                ref={navRef}
                onMouseEnter={() => focusCursor()}
                onMouseLeave={() => unfocusCursor()}
            >
                <div className={`links ${!burgerOpened ? "navClosed" : ""}`}>
                    <Link to={"/"} onClick={closeMenu}>
                        explorer
                    </Link>

                    <Link to={"/archive"} onClick={closeMenu}>
                        archive
                    </Link>

                    <Link to={"/about"} onClick={closeMenu}>
                        about us
                    </Link>

                    <Link to={"/suggest"} onClick={closeMenu}>
                        suggest a song
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
        </>
    );
};

export default Header;
