import { useFrame } from "@react-three/fiber";
import SongTile from "./SongTile";
import { v4 as uuidv4 } from "uuid";
import { useContext, useMemo, useState, useRef, useEffect } from "react";
import { NavigationContext } from "../../contexts/NavigationContext";

const amount = 20;

function Content({
    songs,
    minTileSize,
    maxTileSize,
    minMargin,
    innerBounds,
    outerBounds,
    maxZ,
}) {
    const { cameraPosition } = useContext(NavigationContext);

    const [activeTiles, setActiveTiles] = useState([]);
    const [isInitialGeneration, setIsInitialGeneration] = useState(true);
    const songQueue = useRef([]);

    // Check if placement is valid
    const checkOverlap = (position, size, placed) => {
        for (const tile of placed) {
            const horizontalOverlap =
                Math.abs(tile.position.x - position.x) <
                (tile.size + size) / 2 + minMargin;
            const verticalOverlap =
                Math.abs(tile.position.y - position.y) <
                (tile.size + size) / 2 + minMargin;

            if (horizontalOverlap && verticalOverlap) {
                return true;
            }
        }
        return false;
    };

    // Calculate random position inside bounds
    const getRandomPosition = (bounds, maxZ) => {
        const x = cameraPosition.x + (Math.random() - 0.5) * bounds.x;
        const y = cameraPosition.y + (Math.random() - 0.5) * bounds.y;
        const z = Math.random() * maxZ;
        return { x, y, z };
    };

    const getRandomOuterRingPosition = (innerBound, outerBound, maxZ) => {
        const bands = [
            {
                //Top
                xMin: -outerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: innerBound.y / 2,
                yMax: outerBound.y / 2,
            },
            {
                //Bottom
                xMin: -outerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: -innerBound.y / 2,
            },
            {
                //Left
                xMin: -outerBound.x / 2,
                xMax: -innerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: outerBound.y / 2,
            },
            {
                //Right
                xMin: innerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: outerBound.y / 2,
            },
        ];

        const band = bands[Math.floor(Math.random() * 4)];

        const x =
            cameraPosition.x +
            Math.random() * (band.xMax - band.xMin) +
            band.xMin;
        const y =
            cameraPosition.y +
            Math.random() * (band.yMax - band.yMin) +
            band.yMin;
        const z = Math.random() * maxZ;

        return { x, y, z };
    };

    const isInsideBounds = ({ x, y }, bounds) => {
        const minX = cameraPosition.x - bounds.x / 2;
        const maxX = cameraPosition.x + bounds.x / 2;
        const minY = cameraPosition.y - bounds.y / 2;
        const maxY = cameraPosition.y + bounds.y / 2;

        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    };

    const getNextSong = () => {
        if (songQueue.current.length === 0) {
            initializeSongQueue();
        }
        return songQueue.current.pop();
    };

    const initializeSongQueue = () => {
        const entries = Object.entries(songs);
        const shuffledSongs = shuffle(entries);
        songQueue.current = [...shuffledSongs];
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const generateTile = (isInitialGeneration, newTiles) => {
        const song = getNextSong();
        if (!song) return null;

        // Generate a random size for the tile
        const size = Math.random() * (maxTileSize - minTileSize) + minTileSize;

        // Generate a random position on the outer ring and check for overlaps
        let overlaps,
            position,
            tries = 0;
        do {
            if (isInitialGeneration) {
                position = getRandomPosition(outerBounds, maxZ);
            } else {
                position = getRandomOuterRingPosition(
                    innerBounds,
                    outerBounds,
                    maxZ
                );
            }

            overlaps = checkOverlap(position, size, newTiles);
            tries++;
        } while (overlaps && tries < 20);

        if (tries >= 20) return null;

        // If a valid position was found, return the tile
        return {
            key: uuidv4(),
            song,
            position,
            size,
        };
    };

    useFrame(() => {
        let newTiles = [...activeTiles];

        // Filter out tiles that are outside the camera limits
        newTiles = newTiles.filter(({ position }) =>
            isInsideBounds(position, outerBounds)
        );

        while (newTiles.length < amount) {
            const newTile = generateTile(isInitialGeneration, newTiles);

            if (newTile != null) {
                newTiles.push(newTile);
            } else break;
        }

        setActiveTiles(newTiles);

        if (isInitialGeneration && newTiles.length > 0) {
            setIsInitialGeneration(false);
        }
    });

    return (
        <group>
            {activeTiles.map(({ key, position, size, song }) => (
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
