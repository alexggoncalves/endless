import "./userInteractionPrompt.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import InteractionPromptButton from "./InteractionPromptButton";
import Toggle from "../UI/Toggle";
import { MusicContext } from "../../contexts/MusicContext";

const UserInteractionPrompt = () => {
    const container = useRef();
    const background = useRef();

    const { contextSafe } = useGSAP();
    const { setAutoPlay } = useContext(MusicContext);

    const expandLogo = contextSafe(() => {
        const logo = document.querySelector(".logo");
        gsap.to(logo, {
            duration: 0.15,
            scale: 1.1,
        });
    });

    const closeUserInteractionPrompt = contextSafe((e) => {
        e.preventDefault();

        if (!container.current || !background.current) return;

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

        invertMenuColors();
    });

    const invertMenuColors = contextSafe(() => {
        const playlist = document.querySelector(".playlist-menu-wrapper");
        const background = document.querySelector(".playlist-menu-content");
        const waveSeparator = document.querySelector(".list-separator svg path");

        gsap.to(playlist, {
            color: "#ffffff",
            duration: 1,
            ease: "power1.out",
        });

        gsap.to(background, {
            backgroundColor: "#303030a7",
            duration: 1,
            ease: "power1.out",
        });

        gsap.to(waveSeparator, {
            stroke: "#ffffff",
            duration: 1,
            ease: "power1.out",
        });
    });

    useEffect(() => {}, []);

    return (
        <>
            <div ref={background} id="interaction-prompt-background" />
            <div ref={container} id="interaction-prompt-container">
                <div className="interaction-prompt-text">
                    <p>An ocean of sound. </p>
                    <p>You drift, it plays. </p>
                    <p>Endlessly.</p>
                </div>

                <Toggle
                    initialState={true}
                    label={"auto-play"}
                    callback={(state) => setAutoPlay(state)}
                />
                <InteractionPromptButton
                    closeUserInteractionPrompt={closeUserInteractionPrompt}
                />
            </div>
        </>
    );
};

export default UserInteractionPrompt;
