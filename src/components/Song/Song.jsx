import { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getSongByID } from "../../apiService.js";

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
                <Link
                    to={`${
                        location.pathname?.includes("archive")
                            ? "/archive"
                            : "/"
                    }`}
                >
                    bacc
                </Link>
                <h1>{song.title}</h1>
                <img
                    height={400}
                    src={song.metadata.cover_image.imgix_url}
                    alt={song.title + " cover art"}
                />
            </div>
        );
    } else return <></>;
}

export default Song;
