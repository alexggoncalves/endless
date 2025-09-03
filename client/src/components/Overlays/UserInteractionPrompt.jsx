import "./overlay.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import Toggle from "../UI/Toggle";
import { MusicContext } from "../../contexts/MusicContext";
import { NavigationContext } from "../../contexts/NavigationContext";
import PlaylistReadyButton from "../UI/PlaylistReadyButton";

const UserInteractionPrompt = ({ closeOverlay }) => {
    const container = useRef();
    const background = useRef();

    const { contextSafe } = useGSAP();
    const { setAutoPlay } = useContext(MusicContext);

    return (
        <>
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
            <PlaylistReadyButton
                callback={closeOverlay}
                label={"sounds good"}
            />
        </>
    );
};

export default UserInteractionPrompt;
