import { useEffect, useState } from "react";
import SongTile from "./SongTile";
import { getAllSongs } from "../../apiService.js";

const maxSize = 250,
    minSize = 180;

const boundSize = 1000;

function Content(props) {
    const [songs, setSongs] = useState();

    useEffect(() => {
        getAllSongs().then((songs) => {
            setSongs(songs);
            console.log(songs)
        });
        
    }, []);

    if (songs) {
        return (
            <group>
                {songs?.map((song, index) => {
                    const size = Math.random() * (maxSize - minSize) + minSize;
                    const position = {
                        x: (Math.random() - 0.5) * boundSize,
                        y: (Math.random() - 0.5) * boundSize
                    }
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
}

export default Content;
