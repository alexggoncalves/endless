import "./song.css";

import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";

import { artistsToString, formatTime } from "../../utils";

import { MusicContext } from "../../contexts/MusicContext.jsx";
import { CursorContext } from "../../contexts/CursorContext.jsx";
import { ExplorerContext } from "../../contexts/ExplorerContext.jsx";
import { usePreview } from "../../contexts/PreviewContext.jsx";

import { XIcon, SpotifyLogoIcon } from "../UI/Icons.jsx";
import DividerWaves from "../Waves/DividerWaves.jsx";
import PreviewProgress from "./PreviewProgress.jsx";

function Song() {
    const [song, setSong] = useState();

    const { getSongById, songs } = useContext(MusicContext);
    const { focusCursor, unfocusCursor } = useContext(CursorContext);
    const { isSongPageOpening, isSongPageClosing } =
        useContext(ExplorerContext);
    const preview = usePreview();

    const navigate = useNavigate();
    const location = useLocation();
    const { contextSafe } = useGSAP();

    const { songID } = useParams();
    const coverImage = songs?.[songID]?.image; // Get the preloaded image

    const isSongPageOpen = useRef(false);
    const container = useRef();

    const slideSongPageIn = contextSafe(() => {
        if (
            isSongPageOpen.current ||
            isSongPageOpening.current ||
            isSongPageClosing.current
        )
            return;

        isSongPageOpening.current = true;

        gsap.killTweensOf(container.current);
        gsap.to(container.current, {
            y: "0",
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
                isSongPageOpen.current = true;
                isSongPageOpening.current = false;
            },
        });
    });

    // Slide song page out and navigate to explorer
    const closeSongPage = contextSafe(() => {
        if (
            !isSongPageOpen.current ||
            isSongPageClosing.current ||
            isSongPageOpening.current
        )
            return;

        isSongPageClosing.current = true;

        unfocusCursor();

        preview.stop();

        // Animate container
        gsap.killTweensOf(container.current);
        gsap.to(container.current, {
            duration: 0.6,
            y: "130%",
            ease: "power3.in",
            onComplete: () => {
                navigate("/");
                isSongPageOpen.current = false;
                isSongPageClosing.current = false;
            },
        });
    });

    const snapSongPageToTop = contextSafe(() => {
        gsap.set(container.current, { y: "0" });
        isSongPageOpen.current = true;
        isSongPageOpening.current = false;
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
                            <PreviewProgress songId={song.id} />
                            <div>
                                <h1>{song.name}</h1>
                                <h2>by {artistsToString(song.artists)}</h2>

                                <Link
                                    className="song-link"
                                    to={`https://open.spotify.com/track/${song.id}`}
                                    target="_blank"
                                    onMouseEnter={focusCursor}
                                    onMouseLeave={unfocusCursor}
                                >
                                    <SpotifyLogoIcon />
                                    <span>Listen on Spotify</span>
                                </Link>
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
                            <span className="detail">{formatTime(song.duration_ms)}</span>

                            <span className="detail-label">EXPLICIT</span>
                            <span className="detail">
                                {song.explicit ? "YES" : "NO"}
                            </span>
                        </div>
                    </div>
                    <DividerWaves />
                    <button
                        className="back-button circle-button"
                        onClick={(e) => {
                            closeSongPage();
                        }}
                        onMouseEnter={(e) => {
                            focusCursor();
                        }}
                        onMouseLeave={(e) => {
                            unfocusCursor();
                        }}
                    >
                        <XIcon></XIcon>
                    </button>
                </div>
            </>
        );
    } else return <></>;
}

export default Song;
