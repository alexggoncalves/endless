import "./overlay.css";
import { useContext } from "react";

import Toggle from "../UI/Toggle";
import { PreviewContext } from "../../contexts/PreviewContext";
import PlaylistReadyButton from "../UI/PlaylistReadyButton";

const UserInteractionPrompt = ({ closeOverlay }) => {
    const { setAutoPlay } = useContext(PreviewContext);

    return (
        <>
            <div className="interaction-prompt-text">
                <p>An ocean of sound. </p>
                <p>You drift, it plays. </p>
                <p>Endlessly.</p>
            </div>

            <Toggle
                initialState={true}
                label={"auto-play"}
                callback={(state) => setAutoPlay(state)}
            />
            <PlaylistReadyButton
                callback={closeOverlay}
                label={"sounds good"}
            />
        </>
    );
};

export default UserInteractionPrompt;
