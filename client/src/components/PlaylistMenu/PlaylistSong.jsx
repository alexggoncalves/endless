import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";

const PlaylistSong = ({ song }) => {
    const { songs } = useContext(MusicContext);
    const { unfocusCursor, isMenuInverted } = useContext(CursorContext);
    const navigate = useNavigate();

    const handleClick = () => {
        unfocusCursor();
        navigate(`/explorer/${song.id}`, { state: { fromMain: true } });
    };

    return (
        <div
            className={`playlist-song${isMenuInverted ? " inverted" : ""}`}
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
