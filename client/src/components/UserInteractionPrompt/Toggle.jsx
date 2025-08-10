import { useRef, useState, useContext, useEffect } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NavigationContext } from "../../contexts/NavigationContext";

const Toggle = ({ initialState, label, callback }) => {
    const thumb = useRef();
    const [state, setState] = useState(initialState);
    const [animating, setAnimating] = useState(false);
    const mouseLeft = useRef();
    mouseLeft.current = false;

    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const { contextSafe } = useGSAP();

    if (label) {
        label = label.toUpperCase();
    } else label = "";

    const handleMouseEnter = contextSafe(() => {
        if (!thumb.current) return;

        mouseLeft.current = false;

        focusCursor();
        if (!animating) {
            gsap.killTweensOf(thumb.current);
            gsap.to(thumb.current, {
                borderRadius: "20px",
                duration: 0.6,
            });
        }
    });
    const handleMouseLeave = contextSafe(() => {
        if (!thumb.current) return;

        mouseLeft.current = true;

        unfocusCursor();
        if (!animating) {
            gsap.killTweensOf(thumb.current);
            gsap.to(thumb.current, {
                borderRadius: "0px",
                duration: 0.4,
            });
        }
    });

    const setCorrectState = contextSafe(() => {
        if (!thumb.current) return;
        if (state) {
            gsap.set(thumb.current, { transform: "translateX(80%)" });
            callback(state);
        } else {
            gsap.set(thumb.current, { transform: "translateX(-20%)" });
            callback(state);
        }
    });

    const handleMouseClick = contextSafe(() => {
        if (!thumb.current) return;

        setAnimating(true);

        gsap.to(thumb.current, {
            transform: `translateX(${state ? "-20%" : "80%"})`,
            // borderRadius:"20px",
            duration: 0.2,
            onComplete: () => {
                setAnimating(false);
                gsap.to(thumb.current, {
                    borderRadius: mouseLeft.current ? "0px" : "20px",
                    duration: 0.4,
                });
            },
        });
        callback(!state);

        // update state value
        setState(!state);
    });

    useEffect(() => {
        setCorrectState();
    }, []);

    return (
        <div className="toggle">
            <span className="toggle-label">{label}</span>
            <div
                className="toggle-track"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseClick}
            >
                <div ref={thumb} className="toggle-thumb"></div>
            </div>
            <span className="toggle-state">{state ? "ON" : "OFF"}</span>
        </div>
    );
};

export default Toggle;
