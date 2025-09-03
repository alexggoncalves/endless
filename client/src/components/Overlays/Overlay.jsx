import "./overlay.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import { NavigationContext } from "../../contexts/NavigationContext";

const Overlay = ({ children, isOpen, onClose }) => {
    const container = useRef();
    const background = useRef();
    const firstRender = useRef(true);

    const { contextSafe } = useGSAP();
    const { invertMenuColors } = useContext(NavigationContext);

    const closeOverlay = contextSafe(() => {
        if (!container.current || !background.current) return;

        onClose?.();

        container.current.style.pointerEvents = "none";
        gsap.to(container.current, {
            opacity: 0,
            duration: 1,
            ease: "power1.out",
        });

        gsap.to(background.current, {
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                background.current.style.display = "none";
            },
        });

        invertMenuColors(true);
    });

    const openOverlay = contextSafe(() => {
        if (!container.current || !background.current) return;

        gsap.to(container.current, {
            opacity: 1,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                container.current.style.pointerEvents = "auto";
            },
        });

        background.current.style.display = "block";
        gsap.to(background.current, {
            opacity: 1,
            duration: 1,
            ease: "power1.out",
        });

        invertMenuColors(false);
    });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            if (isOpen) {
                container.current.style.opacity = "1";
                container.current.style.pointerEvents = "auto";
                background.current.style.opacity = "1";
                background.current.style.display = "block";
            } else {
                container.current.style.opacity = "0";
                container.current.style.pointerEvents = "none";
                background.current.style.opacity = "0";
                background.current.style.display = "none";
            }
        } else {
            if (isOpen) {
                openOverlay();
            } else {
                closeOverlay();
            }
        }
    }, [isOpen]);

    return (
        <>
            <div ref={background} className="overlay-background" />
            <div ref={container} className="overlay-container">
                {typeof children === "function"
                    ? children({ closeOverlay })
                    : children}
            </div>
        </>
    );
};

export default Overlay;
