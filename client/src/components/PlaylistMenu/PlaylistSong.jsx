import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";
import { ExplorerContext } from "../../contexts/ExplorerContext";

const PlaylistSong = ({ song }) => {
    const { songs } = useContext(MusicContext);
    const { unfocusCursor } = useContext(CursorContext);
    const { colorsInverted } = useContext(ExplorerContext);

    const navigate = useNavigate();

    const handleClick = () => {
        unfocusCursor();
        navigate(`/explorer/${song.id}`, { state: { fromMain: true } });
    };

    return (
        <div
            className={`playlist-song${colorsInverted ? " inverted" : ""}`}
            onClick={handleClick}
        >
            <img className="playlist-song-image" src={song.image.src} alt="" />
            <div className="playlist-song-details">
                <span>{song.name}</span>
                <span>{songs[song.id].artistsString}</span>
            </div>
        </div>
    );
};

export default PlaylistSong;
