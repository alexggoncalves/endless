import { useFrame } from "@react-three/fiber";
import SongTile from "./SongTile";
import { v4 as uuidv4 } from "uuid";
import { useContext, useMemo } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";

function Content({ songs, minTileSize, maxTileSize, minMargin, boundSize }) {
    const {cameraPosition} = useContext(NavigationContext)
    
    // Check if placement is valid
    const checkOverlap = (position, size, placed) => {
        
        for (const tile of placed) {
            const horizontalOverlap =
                Math.abs(tile.x - position.x) <
                (tile.size + size) / 2 + minMargin;
            const verticalOverlap =
                Math.abs(tile.y - position.y) <
                (tile.size + size) / 2 + minMargin;

            if (horizontalOverlap && verticalOverlap) {
                return true;
            }
        }
        return false;
    };

    // Calculate random position inside bounds
    const getRandomPosition = () => {
        const x = (Math.random() - 0.5) * boundSize.x;
        const y = (Math.random() - 0.5) * boundSize.y;
        const z = Math.random() * boundSize.z;
        return { x, y, z };
    };

    const placements = useMemo(() => {
        const placed = [];

        return Object.entries(songs).map((song) => {
            const size = Math.random() * (maxTileSize - minTileSize) + minTileSize;
            let overlaps = true;
            let position;

            do {
                position = getRandomPosition();
                overlaps = checkOverlap(position, size, placed);
            } while (overlaps);

            placed.push({
                x: position.x,
                y: position.y,
                z: position.z,
                size: size,
            });

            return {
                key: uuidv4(),
                song,
                position,
                size,
            };
        });
    }, [songs, minTileSize, maxTileSize, minMargin]);



    return (
        <group>
            {placements.map(({ key, position, size, song }) => (
                <SongTile
                    key={key}
                    position={position}
                    size={size}
                    song={song[1]}
                />
            ))}
        </group>
    );
}

export default Content;
