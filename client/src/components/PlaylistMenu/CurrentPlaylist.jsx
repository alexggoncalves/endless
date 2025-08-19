import { useContext, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { MusicContext } from "../../contexts/MusicContext";

const CurrentPlaylist = ({currentPlaylist}) => {
    return (
        <div className="current-playlist">
           
            <div className="current-playlist-details">
                
                <span>{currentPlaylist?.name}</span>
                <span>{currentPlaylist?.owner.display_name}</span>
            </div>
             <img className="current-playlist-image" src={currentPlaylist?.images[0].url} alt="" />
        </div>
    );
};

export default CurrentPlaylist;
