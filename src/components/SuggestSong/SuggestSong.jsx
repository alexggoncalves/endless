import "./SuggestSong.css";
import arrowRight from "./../../assets/arrow-right.svg"

const SuggestSong = () => {
    return (
        <>
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
        </>
    );
};

export default SuggestSong;
