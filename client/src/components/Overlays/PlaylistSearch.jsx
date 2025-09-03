import "./overlay.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import Toggle from "../UI/Toggle";
import { MusicContext } from "../../contexts/MusicContext";
import { NavigationContext } from "../../contexts/NavigationContext";
import PlaylistReadyButton from "../UI/PlaylistReadyButton";

const PlaylistSearch = ({ closeOverlay }) => {
    const container = useRef();
    const background = useRef();

    const { contextSafe } = useGSAP();
    const { setAutoPlay } = useContext(MusicContext);

    return (
        <>
            <div className="search-input" >
                <span>PLAYLIST ID (OR LINK)</span>
                <input type="text" />
                <div className="search-button"></div>
            </div>

            <div className="search-result">The playlist wasn't found.</div>
            <PlaylistReadyButton callback={closeOverlay} label={"go"} />
        </>
    );
};

export default PlaylistSearch;
