import { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import "./song.css";
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
                <div>
                    <Link
                        to={`${
                            location.pathname?.includes("archive")
                                ? "/endless/archive"
                                : "/endless/"
                        }`}
                    >
                        back
                    </Link>
                </div>
                <div className="song-details-info-container">
                    <div className="song-details-info">
                        <div>
                            <img
                                height={700}
                                src={song.metadata.cover_image.imgix_url}
                                alt={song.title + " cover art"}
                            />
                        </div>
                        <div>
                            <h1>{song.title}</h1>
                            <h2>by {song.metadata.artist[0].title}</h2>
                            <br></br>
                            <Link
                                to={`${
                                    location.pathname?.includes("archive")
                                        ? "/endless/archive"
                                        : "/endless/"
                                }`}
                            >
                                Listen on spotify
                            </Link>
                        </div>
                        <div>
                            <h3>GENRE</h3>
                            <h4>{song.metadata.genre}</h4>
                            <br></br>
                            <br></br>
                            <h3>RELEASE YEAR</h3>
                            <h4>{song.metadata.year}</h4>
                            <br></br>
                            <br></br>
                            <h3>ALBUM</h3>
                            <h4>{song.metadata.album.title}</h4>
                            <br></br>
                            <br></br>
                            <h3>DURATION</h3>
                            <h4>{song.metadata.duration}</h4>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>
                <div className="song-details-extra-info-container">
                    <div>
                        <h2>THE ALBUM</h2>
                        <h1>{song.metadata.album.title}</h1>
                        <ol>
                            {song.metadata.album.metadata.track_list.split('\n').map((track, index) => (
                                <li key={index}>{track}</li>
                            ))}
                        </ol>
                    </div>   
                    <div>
                        <h2>THE ARTIST</h2>
                        <h1>{song.metadata.artist[0].title}</h1>
                        <p>{song.metadata.artist[0].metadata.biography}</p>
                        <img
                            height={400}
                            src={song.metadata.artist[0].metadata.photo.url}
                            alt={song.metadata.artist[0].title + " artist photo"}
                        />                     
                    </div>                      
                </div>
            </div>
        );
    } else return <></>;
}

export default Song;
