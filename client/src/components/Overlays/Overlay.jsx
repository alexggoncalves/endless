import "./overlay.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import { CursorContext } from "../../contexts/CursorContext";

const Overlay = ({ children, isOpen, onClose }) => {
    const container = useRef();
    const background = useRef();
    const initiallyOpen = useRef(isOpen);
    const prevOpen = useRef(isOpen);

    const { invertMenuColors } = useContext(CursorContext);

    useGSAP(
        () => {
            if (prevOpen.current === isOpen) return;
            prevOpen.current = isOpen;

            gsap.to([background.current, container.current], {
                autoAlpha: isOpen ? 1 : 0,
                duration: 1,
                ease: "power1.out",
                overwrite: "auto",
            });
            invertMenuColors(!isOpen);
        },
        { dependencies: [isOpen] },
    );

    const closeOverlay = () => onClose?.();

    const style = {
        opacity: initiallyOpen.current ? 1 : 0,
        visibility: initiallyOpen.current ? "visible" : "hidden",
    };

    return (
        <>
            <div ref={background} className="overlay-background" style={style} />
            <div ref={container} className="overlay-container" style={style}>
                {typeof children === "function"
                    ? children({ closeOverlay })
                    : children}
            </div>
        </>
    );
};

export default Overlay;
