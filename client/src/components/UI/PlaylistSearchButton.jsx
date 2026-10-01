import { useContext } from "react";

import { CursorContext } from "../../contexts/CursorContext";
import { PlaylistSearchIcon } from "../../Icons";

const PlaylistSearchButton = ({ callback, isOpen }) => {
    const { focusCursor, unfocusCursor, colorsInverted } =
        useContext(CursorContext);

    const handleMouseClick = () => {
        unfocusCursor();
        callback();
    };

    if (!isOpen) {
        return (
            <button
                onMouseEnter={focusCursor}
                onMouseLeave={unfocusCursor}
                onClick={handleMouseClick}
                className={`circle-button playlist-search-button ${colorsInverted && "inverted"}`}
            >
                <PlaylistSearchIcon />
            </button>
        );
    }
};

export default PlaylistSearchButton;
