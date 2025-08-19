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

        gsap.killTweensOf(container);
        gsap.to(container, {
            backgroundColor: "#8f8f8f71",
            duration: 0.2,
            // ease: "power2.inOut",
        });
    });

    const handleMouseLeave = contextSafe(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.killTweensOf(container);
        gsap.to(container, {
            backgroundColor: "#38383800",
            duration: 0.6,
            // ease: "power2.inOut",
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
