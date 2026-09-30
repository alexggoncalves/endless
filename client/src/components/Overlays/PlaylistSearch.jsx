import "./overlay.css";

import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";

import Toggle from "../UI/Toggle";
import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";
import PlaylistReadyButton from "../UI/PlaylistReadyButton";
import { SearchIcon } from "../../Icons";

const PlaylistSearch = ({ closeOverlay }) => {
    const [input, setInput] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const { findPlaylist, setPlaylist } = useContext(MusicContext);

    const { contextSafe } = useGSAP();

    const updateInput = (e) => {
        console.log(e.target.value);
        setInput(e.target.value);
    };

    const handleSearch = contextSafe(async () => {
        const result = await findPlaylist(input);
        console.log(result);
        setSearchResult(result);
    });

    const switchPlaylist = contextSafe(() => {
        if (!searchResult) return;
        setPlaylist(searchResult);
        closeOverlay();
    });

    return (
        <>
            <span className="search-overlay-title">SWITCH PLAYLIST</span>
            <div className="search-input">
                <input
                    onChange={updateInput}
                    placeholder="Enter playlist ID or link"
                    type="text"
                />
                <div onClick={handleSearch} className="circle-button">
                    <SearchIcon></SearchIcon>
                </div>
            </div>

            {searchResult && (
                <>
                    <div className="search-result">
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
                    </div>
                    <PlaylistReadyButton
                        callback={switchPlaylist}
                        label={"switch playlist"}
                    />
                </>
            )}
        </>
    );
};

export default PlaylistSearch;
