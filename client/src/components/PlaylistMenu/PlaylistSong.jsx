import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { MusicContext } from "../../contexts/MusicContext";
import { NavigationContext } from "../../contexts/NavigationContext";

const PlaylistSong = ({ song }) => {
    const containerRef = useRef();

    const { songs } = useContext(MusicContext);
    const { contextSafe } = useGSAP();

    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const navigate = useNavigate();

    const handleClick = contextSafe(() => {
        unfocusCursor();
        navigate(`/explorer/${song.id}`, {
            state: { fromMain: true },
        });
    });

    const handleMouseEnter = contextSafe(() => {
        const container = containerRef.current;

        if (!container) return;
        gsap.to(container, {
            backgroundColor: "#ffffff",
            duration: 0.1,
            ease: "power2.inOut",
        });
    });

    const handleMouseLeave = contextSafe(() => {
        const container = containerRef.current;

        if (!container) return;
        gsap.to(container, {
            backgroundColor: "transparent",
            duration: 0.1,
            ease: "power2.inOut",
        });
    });

    return (
        <div
            ref={containerRef}
            className="playlist-song"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img className="playlist-song-image" src={song.image.src} alt="" />
            <div className="playlist-song-details">
                <span>{song.name}</span>
                <span>{songs[song.id].artistsString}</span>
            </div>
        </div>
    );
};

export default PlaylistSong;
