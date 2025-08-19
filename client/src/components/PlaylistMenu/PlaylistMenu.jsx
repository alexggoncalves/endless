import { useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

import { NavigationContext } from "../../contexts/NavigationContext";
import { MusicContext } from "../../contexts/MusicContext";
import PlaylistSong from "./PlaylistSong";
import Wave from "../Waves/Wave";

const PlaylistMenu = () => {
    const containerRef = useRef();
    const playlistImageRef = useRef();
    const listRef = useRef();
    const playlistDetailsRef = useRef();
    const menuArrowRef = useRef();
    const arrowDownRef = useRef();
    const backgroundRef = useRef();

    const { currentPlaylist, songs } = useContext(MusicContext);
    const { focusCursor, unfocusCursor } = useContext(NavigationContext);

    const { contextSafe } = useGSAP();

    const handleMouseEnter = contextSafe(() => {
        focusCursor();
        expandMenu();
    });

    const expandMenu = contextSafe(() => {
        const container = containerRef.current;
        const playlistImage = playlistImageRef.current;
        const list = listRef.current;
        const playlistDetails = playlistDetailsRef.current;
        const menuArrow = menuArrowRef.current;
        const arrowDown = arrowDownRef.current;

        if (!container || !playlistImage) return;

        // Extend container and list
        gsap.killTweensOf(container);
        gsap.to(container, {
            duration: 0.5,
            ease: "power3.inOut",
            height: "calc(100vh - 44px)",
        });

        gsap.killTweensOf(list);
        gsap.to(list, {
            duration: 0.5,
            ease: "power3.inOut",
            marginTop: "320px",
        });

        gsap.killTweensOf(playlistDetails);
        gsap.to(playlistDetails, {
            duration: 0.5,
            ease: "power2.inOut",
            marginTop: "340px",
        });

        //Expand image
        gsap.killTweensOf(playlistImage);
        gsap.to(playlistImage, {
            duration: 0.5,
            ease: "power3.inOut",
            width: "320px",
            height: "320px",
        });

        // Morph arrow
        gsap.killTweensOf(arrowDown);
        gsap.to(arrowDown, {
            duration: 0.2,
            morphSVG: "#arrow-up",
            ease: "power3.inOut",
        });

        // Move arrow
        gsap.killTweensOf(menuArrow);
        gsap.to(menuArrow, {
            duration: 0.6,
            ease: "power2.inOut",
            top: "270px",
        });
    });

    const closeMenu = contextSafe(() => {
        const container = containerRef.current;
        const playlistImage = playlistImageRef.current;
        const list = listRef.current;
        const playlistDetails = playlistDetailsRef.current;
        const menuArrow = menuArrowRef.current;
        const arrowDown = arrowDownRef.current;

        if (!container || !playlistImage) return;

        gsap.killTweensOf(container);
        gsap.to(container, {
            duration: 0.6,
            ease: "power3.inOut",
            height: "80px",
        });

        gsap.killTweensOf(list);
        gsap.to(list, {
            duration: 0.6,
            ease: "power3.inOut",
            marginTop: "0px",
        });

        gsap.killTweensOf(playlistDetails);
        gsap.to(playlistDetails, {
            duration: 0.6,
            ease: "power3.inOut",
            marginTop: "16px",
        });

        //Shrink image
        gsap.killTweensOf(playlistImage);
        gsap.to(playlistImage, {
            duration: 0.6,
            ease: "power2.inOut",
            width: "80px",
            height: "80px",
        });

        // Move arrow
        gsap.killTweensOf(menuArrow);
        gsap.to(menuArrow, {
            duration: 0.6,
            ease: "power2.inOut",
            top: "0",
        });

        // Morph arrow
        gsap.killTweensOf(arrowDown);
        gsap.to(arrowDown, {
            duration: 0.2,
            morphSVG: "#arrow-down",
            ease: "power2.inOut",
        });
    });

    const handleMouseLeave = () => {
        unfocusCursor();
        closeMenu();
    };

    if (!songs) return;
    return (
        <div
            ref={containerRef}
            className="playlist-menu-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="playlist-menu-background"></div>
            <div ref={backgroundRef} className="playlist-menu-content">
                {/* Current playlist */}
                <div className="current-playlist">
                    <div
                        ref={playlistDetailsRef}
                        className="current-playlist-details"
                    >
                        <span>{currentPlaylist?.name}</span>
                        <span>by {currentPlaylist?.owner.display_name}</span>
                    </div>
                    <img
                        ref={playlistImageRef}
                        className="current-playlist-image"
                        src={currentPlaylist?.images[0].url}
                        alt=""
                    ></img>
                    <svg
                        ref={menuArrowRef}
                        className="menu-arrow"
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 800 800"
                    >
                        <path
                            ref={arrowDownRef}
                            id="arrow-down"
                            d="m205.57 237.75 178.67 178.67c8.7 8.7 22.81 8.7 31.51 0l178.67-178.67c23.52-23.52 61.68-23.46 85.13.14l1.29 1.3c23.34 23.49 23.28 61.43-.14 84.85L442.49 562.25c-23.47 23.47-61.52 23.47-84.99 0L119.29 324.04c-23.41-23.41-23.48-61.36-.14-84.85l1.29-1.3c23.45-23.6 61.6-23.66 85.13-.14Z"
                            style={{
                                fill: "#ffffffff",
                            }}
                        />
                        <path
                            id="arrow-up"
                            d="M594.43 562.25 415.76 383.58c-8.7-8.7-22.81-8.7-31.51 0L205.58 562.25c-23.52 23.52-61.68 23.46-85.13-.14l-1.29-1.3c-23.34-23.49-23.28-61.43.14-84.85l238.21-238.21c23.47-23.47 61.52-23.47 84.99 0l238.21 238.21c23.41 23.41 23.48 61.36.14 84.85l-1.29 1.3c-23.45 23.6-61.6 23.66-85.13.14Z"
                            style={{
                                fill: "none",
                            }}
                        />
                    </svg>
                </div>
                <div ref={listRef} className="list-wrapper">
                    <div className="list-separator">
                        <Wave
                            weight={10}
                            direction={1}
                            baseSpeed={0.1}
                            scrollSpeed={0}
                        />
                    </div>

                    <div className="list">
                        {[...Object.entries(songs)].map(([key, value]) => {
                            return <PlaylistSong key={key} song={value} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistMenu;
