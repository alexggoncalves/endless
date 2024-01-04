import { useEffect, useState } from "react";
import SongTile from "./SongTile";
import { getAllSongs } from "../../apiService.js";

const maxSize = 250,
    minSize = 180;

const boundSize = 1000;

import { useContext } from "react";
import { MusicContext } from "../../contexts/MusicContext.jsx";

function Content(props) {
    const { getAllSongs, songs } = useContext(MusicContext);

    useEffect(() => {
        getAllSongs();
    }, []);

    return (
        <group>
            {songs?.map((song, index) => {
                const size = Math.random() * (maxSize - minSize) + minSize;
                const position = {
                    x: (Math.random() - 0.5) * boundSize,
                    y: (Math.random() - 0.5) * boundSize,
                };
                return (
                    <SongTile
                        key={index}
                        position={position}
                        size={size}
                        song={song}
                    />
                );
            })}
        </group>
    );
}

export default Content;
