import "./song.css";

import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "../../contexts/NavigationContext.jsx";
import { artistsToString } from "../../utils";

import spotify from "../../assets/spotify.png";

import { MusicContext } from "../../contexts/MusicContext.jsx";
import DividerWaves from "../Waves/DividerWaves.jsx";
import { SpotifyContext } from "../../contexts/SpotifyContext.jsx";

function Song() {
    // const { getSongByID, songs } = useContext(MusicContext);
    const { getSongById, songs } = useContext(SpotifyContext);
    const [song, setSong] = useState();
    const [artist, setArtist] = useState();

    const {
        expandButton,
        shrinkButton,
        focusCursor,
        unfocusCursor,
        isSongPageAnimating,
    } = useContext(NavigationContext);

    const navigate = useNavigate();
    const location = useLocation();
    const { contextSafe } = useGSAP();

    const { songID } = useParams();
    const coverImage = songs?.[songID]?.image; // Get the preloaded image

    const isSongPageOpen = useRef(false);

    const container = useRef();
    const backButton = useRef();

    const slideSongPageIn = contextSafe(() => {
        if (isSongPageOpen.current || isSongPageAnimating.current) return;
        if (!backButton?.current || !container?.current) return;

        isSongPageAnimating.current = true;

        // Slide back button in
        gsap.killTweensOf(backButton.current);
        gsap.fromTo(
            backButton.current,
            { y: "-300%" },
            { duration: 0.6, ease: "power3.inOut", y: "0" }
        );

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
        if (!backButton?.current || !container?.current) return;

        isSongPageAnimating.current = true;

        // Hide back button
        gsap.killTweensOf(backButton.current);
        gsap.to(backButton.current, { duration: 0.4, y: "-300%" });

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
        gsap.set(backButton.current, { y: "0" });
        isSongPageOpen.current = true;
        isSongPageAnimating.current = false;
    });

    useEffect(() => {
        // Fetch song details
        getSongById(songID).then((song) => setSong(song));
    }, []);

    useEffect(() => {
        // if(song) console.log(song)
        // If user comes from inside the website ->  slide page in
        // Otherwise: place it on original position
        if (location.state?.fromMain) {
            slideSongPageIn();
        } else {
            snapSongPageToTop();
        }
    }, [song]);

    if (song) {
        return (
            <>
                <Link
                    ref={backButton}
                    className="back-button"
                    onClick={(e) => {
                        e.preventDefault();
                        slideSongPageOut();
                    }}
                    onMouseEnter={(e) => {
                        e.preventDefault();
                        expandButton(backButton);
                        focusCursor();
                    }}
                    onMouseLeave={(e) => {
                        e.preventDefault();
                        shrinkButton(backButton);
                        unfocusCursor();
                    }}
                >
                    X
                </Link>
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
                            {/* <span className="detail-label">GENRE</span>
                            <span className="detail">
                                {song.metadata.genre}
                            </span>  */}

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

                    <div className="song-extra-info-container">
                        <div className="song-extra-info-section">
                            <h2>THE ALBUM</h2>
                            <h1>{song.album.name}</h1>
                            {/* <ol>
                                {song.metadata.album.metadata.track_list
                                    .split("\n")
                                    .map((track, index) => (
                                        <li key={index}>{track}</li>
                                    ))}
                            </ol> */}
                        </div>

                        <DividerWaves mobileOnly={true} />

                        <div className="song-extra-info-section">
                            <h2>THE ARTIST</h2>
                            <h1>{song.artists[0].name}</h1>
                            <p className="bio">
                                {/* {song.metadata.artist[0].metadata.biography} */}
                            </p>
                            {/* <img
                                className="artist-image"
                                height={400}
                                src={song.metadata.artist[0].metadata.photo.url}
                                alt={
                                    song.metadata.artist[0].title +
                                    " artist photo"
                                }
                            /> */}
                        </div>
                    </div>
                    <DividerWaves />
                </div>
            </>
        );
    } else return <></>;
}

export default Song;
