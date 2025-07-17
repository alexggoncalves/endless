import "./song.css";

import { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

import lines from "../../assets/lines.svg";
import spotify from "../../assets/spotify.png";
import back from "../../assets/back-button.svg";

import { MusicContext } from "../../contexts/MusicContext.jsx";

function Song() {
    const { getSongByID, songs } = useContext(MusicContext);

    const { songID } = useParams();
    const containerRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const [song, setSong] = useState();
    const [songOpened, setSongOpened] = useState(true);

    // Get the preloaded image
    const coverImage = songs?.[songID]?.coverImage;

    useEffect(() => {
        // Fetch song details
        getSongByID(songID).then((song) => setSong(song));
    }, []);

    useEffect(() => {
        // If user comes from inside the website ->  slide page in
        // Otherwise: place it on original position
        if (location.state?.fromMain) {
            slideIn();
        } else {
            gsap.set(containerRef.current, { y: '0' });
        }
    }, [song]);

    // Slide song page out and navigate to explorer
    const closePage = () => {
        setSongOpened(false);
        gsap.to(containerRef.current, { duration: 0.5, y: "100%" }).then(() => {
            navigate(`/`);
        });
    };

    const slideIn = () => {
        gsap.to(containerRef.current, { duration: 0.5, y: "0", ease: "power3.out", });
    };
    

    if (song) {
        return (
            <div ref={containerRef} className="song-page">
                <div className="song-details-container">
                    <div className="go-back">
                        <h2>
                            <Link onClick={closePage}>
                                <img src={back} alt={"back button"} />
                                go back
                            </Link>
                        </h2>
                    </div>

                    {coverImage && (
                        <img
                            src={coverImage.src}
                            alt={song.title + " cover art"}
                        />
                    )}

                    <div className="song-info">
                        <h1>{song.title}</h1>
                        <h2>by {song.metadata.artist[0].title}</h2>
                        <div className="song-link">
                            <Link
                                to={`https://open.spotify.com/track/${song.metadata.spotify_id}`}
                                target="_blank"
                            >
                                Listen on spotify
                            </Link>
                            <img src={spotify} alt={"spotify logo"} />
                        </div>
                    </div>

                    <div className="song-details">
                        <span className="detail-label">GENRE</span>
                        <span className="detail">{song.metadata.genre}</span>

                        <span className="detail-label">RELEASE YEAR</span>
                        <span className="detail">{song.metadata.year}</span>

                        <span className="detail-label">ALBUM</span>
                        <span className="detail">
                            {song.metadata.album.title}
                        </span>

                        <span className="detail-label">DURATION</span>
                        <span className="detail">{song.metadata.duration}</span>

                        <span className="detail-label">LANGUAGE</span>
                        <span className="detail">{song.metadata.language}</span>
                    </div>
                </div>

                <div className="divider-lines">
                    <img src={lines} alt={"divider lines"} />
                </div>

                <div className="song-extra-info-container">
                    <div>
                        <h2>THE ALBUM</h2>
                        <h1>{song.metadata.album.title}</h1>
                        <ol>
                            {song.metadata.album.metadata.track_list
                                .split("\n")
                                .map((track, index) => (
                                    <li key={index}>{track}</li>
                                ))}
                        </ol>
                    </div>
                    <div className="divider-lines mobile-only">
                        <img src={lines} alt={"divider lines"} />
                    </div>

                    <div>
                        <h2>THE ARTIST</h2>
                        <h1>{song.metadata.artist[0].title}</h1>
                        <p className="bio">
                            {song.metadata.artist[0].metadata.biography}
                        </p>
                        <img
                            className="artist-image"
                            height={400}
                            src={song.metadata.artist[0].metadata.photo.url}
                            alt={
                                song.metadata.artist[0].title + " artist photo"
                            }
                        />
                    </div>
                </div>
                <div className="divider-lines">
                    <img src={lines} alt={"divider lines"} />
                </div>
            </div>
        );
    } else return <></>;
}

export default Song;
