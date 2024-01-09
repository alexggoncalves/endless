import { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import "./song.css";
import lines from "../../assets/lines.svg"
import spotify from "../../assets/spotify.png"
import back from "../../assets/back-button.svg"
import { MusicContext } from "../../contexts/MusicContext.jsx";

function Song() {
    const { songID } = useParams();
    const location = useLocation();

    const [song, setSong] = useState();

    const { getSongByID } = useContext(MusicContext);

    useEffect(() => {
        getSongByID(songID).then((song) => setSong(song));
    }, []);

    if (song) {
        return (
            <div className="song-details-container">          
                <div className="go-back">
                    <h2>
                        <Link
                            to={`${
                                location.pathname?.includes("archive")
                                    ? "/endless/archive"
                                    : "/endless/"
                            }`}
                        >   
                            <img
                            src={back}
                            alt={"back button"}
                            />
                            go back
                        </Link>
                    </h2>
                </div>
                <div className="song-details-info-container">
                    <div className="song-details-info">
                        <div>
                            <img
                                src={song.metadata.cover_image.imgix_url}
                                alt={song.title + " cover art"}
                            />
                        </div>
                        <div>
                            <h1>{song.title}</h1>
                            <h2>by {song.metadata.artist[0].title}</h2>

                            <div className="song-link">
                                <h2>
                                    <Link
                                        to={`https://open.spotify.com/track/${
                                            song.metadata.spotify_id
                                        }`}
                                    >
                                        Listen on spotify
                                    </Link>
                                    <img
                                        src={spotify}
                                        alt={"spotify logo"}
                                    />
                                </h2>
                            </div>
                        </div>
                        <div>

                            <span className="detail-label">GENRE</span>
                            <span className="detail">{song.metadata.genre}</span>

                            <span className="detail-label">RELEASE YEAR</span>
                            <span className="detail">{song.metadata.year}</span>

                            <span className="detail-label">ALBUM</span>
                            <span className="detail">{song.metadata.album.title}</span>

                            <span className="detail-label">DURATION</span>
                            <span className="detail">{song.metadata.duration}</span>

                        </div>
                    </div>
                </div>
                <div className="divider-lines">
                    <img
                        src={lines}
                        alt={"divider lines"}
                    />
                </div>
                <div className="song-details-extra-info-container">
                    <div>
                        <h2>THE ALBUM</h2>
                        <h1>{song.metadata.album.title}</h1>
                        <h3>
                            <ol>
                                {song.metadata.album.metadata.track_list.split('\n').map((track, index) => (
                                    <li key={index}>{track}</li>
                                ))}
                            </ol>
                        </h3>
                    </div>   
                    <div>
                        <h2>THE ARTIST</h2>
                        <h1>{song.metadata.artist[0].title}</h1>
                        <div className="bio-container">
                            <h3>{song.metadata.artist[0].metadata.biography}</h3>
                        </div>
                        <img
                            height={400}
                            src={song.metadata.artist[0].metadata.photo.url}
                            alt={song.metadata.artist[0].title + " artist photo"}
                        />                     
                    </div>                      
                </div>
                <div className="divider-lines">
                    <img
                        src={lines}
                        alt={"divider lines"}
                    />
                </div>
            </div>
        );
    } else return <></>;
}

export default Song;
