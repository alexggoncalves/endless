import { useContext } from "react";

import { CursorContext } from "../../contexts/CursorContext";
import { ExplorerContext } from "../../contexts/ExplorerContext";
import { PlaylistSearchIcon } from "./Icons";

const PlaylistSearchButton = ({ callback, isOpen }) => {
    const { focusCursor, unfocusCursor } = useContext(CursorContext);
    const { colorsInverted } = useContext(ExplorerContext);

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
