import { useContext, useEffect, useState } from "react";

import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";

const PlaylistReadyButton = ({ callback, label }) => {
    const { loading } = useContext(MusicContext);
    const { focusCursor, unfocusCursor } = useContext(CursorContext);

    const [locked, setLocked] = useState(true);

    useEffect(() => {
        if (!loading) setLocked(false);
    }, [loading]);

    const handleAccept = (e) => {
        if (!locked) callback(e);
    };

    return (
        <div className="pill-button">
            <button
                onClick={handleAccept}
                onMouseEnter={() => focusCursor()}
                onMouseLeave={unfocusCursor}
            >
                {label}
            </button>
            <div className={"loader-container" + (locked ? "" : " is-hidden")}>
                <div className="loader"></div>
            </div>
        </div>
    );
};

export default PlaylistReadyButton;