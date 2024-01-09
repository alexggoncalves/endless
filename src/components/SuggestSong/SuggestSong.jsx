import "./SuggestSong.css";
import arrowRight from "./../../assets/arrow-right.svg"
import lines from "../../assets/lines.svg"

const SuggestSong = () => {
    return (
        <div className="no-scroll">
            <div className="song-suggest-wrapper">
                <h2 className="black-text suggest-title">
                    Would you like to <br /> suggest us a song?
                </h2>
                <input
                    className="suggestion-input"
                    placeholder="Song title..."
                />
                <input className="suggestion-input" placeholder="Artist..." />

                <div className="send-button">
                    <span>SEND</span>
                    <img src={arrowRight} alt={"send"} />
                </div>
            </div>

            <div className="divider-lines">
                    <img
                        src={lines}
                        alt={"divider lines"}
                    />
                </div>
        </div>
    );
};

export default SuggestSong;
