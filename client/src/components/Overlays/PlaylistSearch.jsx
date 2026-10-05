import "./overlay.css";

import { useContext, useState } from "react";

import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";
import PlaylistReadyButton from "../UI/PlaylistReadyButton";
import { SearchIcon, XIcon } from "../UI/Icons";

const PlaylistSearch = ({ closeOverlay }) => {
    const [input, setInput] = useState("");

    const { findPlaylist, setPlaylist, currentPlaylist } =
        useContext(MusicContext);

    const { focusCursor, unfocusCursor } = useContext(CursorContext);
    const [searchResult, setSearchResult] = useState(currentPlaylist);

    const [resultFound, setResultFound] = useState(false);

    const updateInput = (e) => {
        setInput(e.target.value);
    };

    const handleSearch = async () => {
        const result = await findPlaylist(input);
        setSearchResult(result);
        setResultFound(!!result);
    };

    const switchPlaylist = () => {
        if (!searchResult) return;
        setPlaylist(searchResult);
        setResultFound(false);
        setInput("");
        closeOverlay();
    };

    const handleMouseEnter = () => {
        focusCursor();
    };

    const handleMouseLeave = () => {
        unfocusCursor();
    };

    return (
        <>
            <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={closeOverlay}
                className={`circle-button inverted`}
            >
                <XIcon />
            </button>
            <span className="search-overlay-title">SWITCH PLAYLIST</span>
            <div className="search-input">
                <input
                    value={input}
                    onChange={updateInput}
                    placeholder="Enter playlist's ID"
                    type="text"
                />
                <div
                    onClick={handleSearch}
                    className="circle-button inverted"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <SearchIcon></SearchIcon>
                </div>
            </div>

            <div className="search-result">
                {searchResult && (
                    <>
                        <img
                            src={searchResult.images[0].url}
                            alt={searchResult.name}
                        />
                        <div className="result-details">
                            <span className="result-details-name">
                                {searchResult.name}
                            </span>
                            <span className="result-details-owner">
                                by {searchResult.owner.display_name}
                            </span>
                        </div>
                        <span className="result-details-total">
                            {searchResult.tracks.total} songs
                        </span>
                    </>
                )}
            </div>
            {resultFound ? (
                <PlaylistReadyButton
                    callback={switchPlaylist}
                    label={"switch playlist"}
                />
            ) : (
                <div className="pill-button">
                    <button className="pill-disabled" disabled>
                        CURRENT PLAYLIST
                    </button>
                </div>
            )}
        </>
    );
};

export default PlaylistSearch;
