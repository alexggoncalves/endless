import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSongByID } from "../apiService.js";

function Song() {
    const [songInfo, setInfo] = useState(null);
    const { songID } = useParams();

    useEffect(() => {
        getSongByID(songID).then((response) => {
            setInfo(response);
        });
    }, []);

    if (songInfo) {
        return (
            <>
                <h1>{songInfo.title}</h1>
                <img
                    height={200}
                    src={songInfo.metadata.cover_image.imgix_url}
                    alt={songInfo.title + " cover art"}
                />
            </>
        );
    } else return <></>;
}

export default Song;
