import { SpotifyContext } from "../../contexts/SpotifyContext";
import { useContext, useEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NavigationContext } from "../../contexts/NavigationContext";

const InteractionPromptButton = ({ closeUserInteractionPrompt }) => {
    const { loading } = useContext(SpotifyContext);
    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const loader = useRef();
    const button = useRef();

    const { contextSafe } = useGSAP();

    const [locked, setLocked] = useState(true);

    const logo = document.getElementById("logo");

    const handleAccept = (e) => {
        if (!locked) {
            closeUserInteractionPrompt(e);
        }
    };

    const fadeOutLoader = contextSafe(() => {
        gsap.to(loader.current, {
            opacity: 0,
            delay: 0.1,
            duration: 1,
        });
        setLocked(false);
    });
    const fadeInLoader = contextSafe(() => {
        gsap.to(loader.current, {
            opacity: 1,
            duration: 0.2,
        });
    });

    const handleMouseEnter = contextSafe((e) => {
        if (!button.current) return;
        focusCursor();

        gsap.to(button.current, {
            backgroundColor: "#dfdfdf",
            color: "#303030",
            borderRadius: "25px",
            duration: 0.3,
        });
    });

    const handleMouseLeave = contextSafe(() => {
        if (!button.current) return;

        unfocusCursor();

        gsap.to(button.current, {
            color: "#dfdfdf",
            backgroundColor: "transparent",
            duration: 0.3,
        });
    });

    const setBigLogo = contextSafe(() => {
        gsap.set(logo, { fontSize: "30rem" });
    });

    const normalizeLogo = contextSafe(() => {
        const logo = document.getElementById("logo");

        gsap.to(logo, { duration: 0.1, fontSize: "1rem" });
    });

    useEffect(() => {
        if (!loader.current) return;
        if (!locked) return;

        if (loading) {
            fadeInLoader();
            setBigLogo();
        } else {
            fadeOutLoader();
        }
    }, [loading]);

    useEffect(() => {
        console.log(logo);
        if (logo) {
            console.log(logo);
            gsap.set(logo, { fontSize: "30rem" });
        }
    }, [logo]);

    return (
        <div className="interaction-button">
            <button
                ref={button}
                onClick={handleAccept}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                sounds good
            </button>
            <div ref={loader} className="loader-container">
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default InteractionPromptButton;
