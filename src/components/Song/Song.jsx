import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getSongByID } from "../../apiService.js";

import "./song.css";

function Song() {
    const [songInfo, setInfo] = useState(null);
    const { songID } = useParams();
    const location = useLocation();

    useEffect(() => {
        getSongByID(songID).then((response) => {
            setInfo(response);
        });
    }, []);

    if (songInfo) {
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
                <h1>{songInfo.title}</h1>
                <img
                    height={400}
                    src={songInfo.metadata.cover_image.imgix_url}
                    alt={songInfo.title + " cover art"}
                />
            </div>
        );
    } else return <></>;
}

export default Song;
