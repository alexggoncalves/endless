import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useContext, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { NavigationContext } from "../contexts/NavigationContext";
import { SpotifyContext } from "../contexts/SpotifyContext";

const PageIndicator = () => {
    return <div className="page-indicator"></div>;
};

const Header = () => {
    const navRef = useRef();
    const navigate = useNavigate();

    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const { contextSafe } = useGSAP();

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
                    navigate(`/`, { relative: true });
                },
            }
        );
    });

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
            {/* <nav
                ref={navRef}
                onMouseEnter={() => focusCursor()}
                onMouseLeave={() => unfocusCursor()}
            >
                <img src={burgeropen} className="burger" />
            </nav> */}
        </>
    );
};

export default Header;
