import { useEffect, useState } from "react";
import SongTile from "./SongTile";
import { v4 as uuidv4 } from "uuid";

const maxSize = 250,
    minSize = 180,
    minMargin = 50;

const boundSize = 2000;

import { useContext } from "react";
import { MusicContext } from "../../contexts/MusicContext.jsx";

function Content(props) {
    const { getAllSongs, songs } = useContext(MusicContext);
    // const [placements, setPlacements] = useState([]);
    const placements = []

    useEffect(() => {
        getAllSongs();
    }, []);

    const getRandomPosition = () => {
        const x = (Math.random() - 0.5) * boundSize;
        const y = (Math.random() - 0.5) * boundSize;
        return { x: x, y: y };
    };

    const checkOverlap = (position, size) => {
        for (const tile of placements) {
            const horizontalOverlap = Math.abs(tile.x - position.x) < (tile.size + size ) / 2 + minMargin;
            const verticalOverlap = Math.abs(tile.y - position.y) < (tile.size + size ) / 2 + minMargin;
        
            if (horizontalOverlap && verticalOverlap) {
                return true;
            }
        }

        return false;
    };

    return (
        <group>
            {songs?.map((song, index) => {
                const size = Math.random() * (maxSize - minSize) + minSize;
                let overlaps = true;
                let position;

                do{
                    position = getRandomPosition();
                    overlaps = checkOverlap(position, size);
                } while(overlaps)
                
                placements.push({x: position.x, y: position.y, size: size })

                return (
                    <SongTile
                        key={uuidv4()}
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
