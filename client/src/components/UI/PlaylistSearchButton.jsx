import {useContext} from "react";

import { CursorContext } from "../../contexts/CursorContext";
import { PlaylistSearchIcon, XIcon } from "../../Icons";

const PlaylistSearchButton = ({ callback, isOpen }) => {
    const { focusCursor, unfocusCursor } = useContext(CursorContext);

    const handleMouseClick = () => {
        unfocusCursor();
        callback();
    }

    if (!isOpen) {
        return (
            <button onMouseEnter={focusCursor} onMouseLeave={unfocusCursor} onClick={handleMouseClick} className="circle-button playlist-search-button">
                <PlaylistSearchIcon />
            </button>
        );
    }
};

export default PlaylistSearchButton;
