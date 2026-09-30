import "./song.css";

import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { CursorContext } from "../../contexts/CursorContext.jsx";
import { artistsToString } from "../../utils";

import spotify from "../../assets/spotify.png";
import DividerWaves from "../Waves/DividerWaves.jsx";

import { MusicContext } from "../../contexts/MusicContext.jsx";
import { XIcon } from "../../Icons.jsx";

function Song() {
    const { getSongById, songs } = useContext(MusicContext);
    const [song, setSong] = useState();

    const { focusCursor, unfocusCursor, isSongPageAnimating } =
        useContext(CursorContext);

    const navigate = useNavigate();
    const location = useLocation();
    const { contextSafe } = useGSAP();

    const { songID } = useParams();
    const coverImage = songs?.[songID]?.image; // Get the preloaded image

    const isSongPageOpen = useRef(false);
    const container = useRef();

    const slideSongPageIn = contextSafe(() => {
        if (isSongPageOpen.current || isSongPageAnimating.current) return;

        isSongPageAnimating.current = true;

        gsap.killTweensOf(container.current);
        gsap.to(container.current, {
            y: "0",
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
                isSongPageOpen.current = true;
                isSongPageAnimating.current = false;
            },
        });
    });

    // Slide song page out and navigate to explorer
    const slideSongPageOut = contextSafe(() => {
        if (!isSongPageOpen.current || isSongPageAnimating.current) return;

        isSongPageAnimating.current = true;

        // The back button unmounts without a mouseleave, so release the cursor now
        unfocusCursor();

        // Animate container
        gsap.killTweensOf(container.current);
        gsap.to(container.current, {
            duration: 0.6,
            y: "130%",
            ease: "power3.in",
            onComplete: () => {
                navigate("/");
                isSongPageOpen.current = false;
                isSongPageAnimating.current = false;
            },
        });
    });

    const snapSongPageToTop = contextSafe(() => {
        gsap.set(container.current, { y: "0" });
        isSongPageOpen.current = true;
        isSongPageAnimating.current = false;
    });

    useEffect(() => {
        let cancelled = false;
        getSongById(songID).then((s) => {
            if (!cancelled) setSong(s);
        });
        return () => {
            cancelled = true;
        };
    }, [songID]);

    useEffect(() => {
        if (!song) return;
        if (location.state?.fromMain) slideSongPageIn();
        else snapSongPageToTop();
    }, [song]);

    if (song) {
        return (
            <>
                <div ref={container} className="song-page">
                    <div className="song-details-container">
                        {coverImage && (
                            <img
                                src={coverImage.src}
                                alt={song.name + " cover art"}
                            />
                        )}

                        <div className="song-info">
                            <h1>{song.name}</h1>
                            <h2>by {artistsToString(song.artists)}</h2>
                            <div className="song-link">
                                <Link
                                    to={`https://open.spotify.com/track/${song.id}`}
                                    target="_blank"
                                >
                                    Listen on spotify
                                </Link>
                                <img src={spotify} alt={"spotify logo"} />
                            </div>
                        </div>

                        <div className="song-details">
                            <span className="detail-label">RELEASE DATE</span>
                            <span className="detail">
                                {song.album.release_date}
                            </span>

                            <span className="detail-label">ALBUM</span>
                            <span className="detail">{song.album.name}</span>

                            <span className="detail-label">DURATION</span>
                            <span className="detail">{song.duration_ms}</span>

                            <span className="detail-label">EXPLICIT</span>
                            <span className="detail">
                                {song.explicit ? "YES" : "NO"}
                            </span>
                        </div>
                    </div>
                    <DividerWaves />
                    <Link
                        className="back-button circle-button"
                        onClick={(e) => {
                            e.preventDefault();
                            slideSongPageOut();
                        }}
                        onMouseEnter={(e) => {
                            e.preventDefault();
                            focusCursor();
                        }}
                        onMouseLeave={(e) => {
                            e.preventDefault();
                            unfocusCursor();
                        }}
                    >
                        <XIcon></XIcon>
                    </Link>
                </div>
            </>
        );
    } else return <></>;
}

export default Song;
