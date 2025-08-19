import { useFrame } from "@react-three/fiber";
import SongTile from "./SongTile";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState, useRef } from "react";
import { ExplorerControlsContext } from "../../contexts/ExplorerControlsContext";
import { MusicContext } from "../../contexts/MusicContext";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import { shuffleArray } from "../../utils.js";

import tileMask from "./../../assets/tile-mask.png";

const MAX_PLACEMENT_TRIES = 3;

function Content({
    songs,
    minTileSize,
    maxTileSize,
    minMargin,
    innerBounds,
    outerBounds,
    maxZ,
    amount,
    maxEqualTileDistance,
}) {
    const { cameraPosition } = useContext(ExplorerControlsContext);
    const { setLoading } = useContext(MusicContext);

    const [activeTiles, setActiveTiles] = useState([]);
    const activeTilesRef = useRef([]);
    const frameCount = useRef(0);

    const [isInitialGeneration, setIsInitialGeneration] = useState(true);
    const songQueue = useRef([]);

    const mask = useLoader(TextureLoader, tileMask);

    // Check if placement is valid
    // Test overlap and distance to same song
    const validatePosition = (songID, position, size, placed) => {
        for (const tile of placed) {
            const horizontalOverlap =
                Math.abs(tile.position.x - position.x) <
                (tile.size + size) / 2 + minMargin;

            const verticalOverlap =
                Math.abs(tile.position.y - position.y) <
                (tile.size + size) / 2 + minMargin;

            if (songID === tile.song[0]) {
                const dx = position.x - tile.position.x;
                const dy = position.y - tile.position.y;
                const distSq = dx * dx + dy * dy;

                if (distSq <= maxEqualTileDistance * maxEqualTileDistance)
                    return false;
            }

            if (horizontalOverlap && verticalOverlap) {
                return false;
            }
        }
        return true;
    };

    // Calculate random position inside bounds
    const getRandomPosition = (bounds, maxZ) => {
        const x = cameraPosition.x + (Math.random() - 0.5) * bounds.x;
        const y = cameraPosition.y + (Math.random() - 0.5) * bounds.y;
        const z = Math.random() * maxZ;
        return { x, y, z };
    };

    // Calculate a random position outside the user view
    const getRandomOuterRingPosition = (innerBound, outerBound, maxZ) => {
        // Define the limits of the spawn bands
        const bands = [
            {
                // Top
                xMin: -outerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: innerBound.y / 2,
                yMax: outerBound.y / 2,
            },
            {
                // Bottom
                xMin: -outerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: -innerBound.y / 2,
            },
            {
                // Left
                xMin: -outerBound.x / 2,
                xMax: -innerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: outerBound.y / 2,
            },
            {
                // Right
                xMin: innerBound.x / 2,
                xMax: outerBound.x / 2,
                yMin: -outerBound.y / 2,
                yMax: outerBound.y / 2,
            },
        ];

        // Calculate each band's area and total area
        const areas = bands.map(
            (band) => (band.xMax - band.xMin) * (band.yMax - band.yMin)
        );
        const totalArea = areas.reduce((sum, area) => sum + area, 0);

        // Pick a random band weighted by area
        let rand = Math.random() * totalArea;
        let bandIndex = 0;

        for (let i = 0; i < areas.length; i++) {
            if (rand < areas[i]) {
                bandIndex = i;
                break;
            }
            rand -= areas[i];
        }

        const band = bands[bandIndex];

        // Find a random position inside the chosen band
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
        // Calculate bounds in relation to the cameraPosition
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
        if (!songs) return;
        const entries = Object.entries(songs);
        const shuffledSongs = shuffleArray(entries);
        songQueue.current = [...shuffledSongs];
    };

    const generateTile = (isInitialGeneration, newTiles) => {
        const song = getNextSong();
        if (!song) return null;

        // Generate a random size for the tile
        const size = Math.random() * (maxTileSize - minTileSize) + minTileSize;

        // Generate a random position on the outer ring and check for overlaps
        let positionIsValid,
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

            positionIsValid = validatePosition(
                song[0],
                position,
                size,
                newTiles
            );
            tries++;
        } while (!positionIsValid && tries < MAX_PLACEMENT_TRIES);

        if (tries >= MAX_PLACEMENT_TRIES) return null;

        // If a valid position was found, return the tile
        return {
            key: uuidv4(),
            song,
            position,
            size,
        };
    };

    useFrame(() => {
        frameCount.current++;
        if (frameCount.current % 10 !== 0) return;

        let newTiles = [...activeTilesRef.current];

        // Filter out tiles that are outside the camera limits
        newTiles = newTiles.filter(({ position }) =>
            isInsideBounds(position, outerBounds)
        );

        // Generate tiles until desider amount is reached
        while (newTiles.length < amount) {
            const newTile = generateTile(isInitialGeneration, newTiles);

            if (newTile != null) {
                newTiles.push(newTile);
            } else break;
        }

        // If there were any changes, update the active tiles state
        if (newTiles.length != activeTilesRef.current.length) {
            activeTilesRef.current = newTiles;
            setActiveTiles([...newTiles]);
        }

        if (isInitialGeneration && newTiles.length > 0) {
            setIsInitialGeneration(false);
            setLoading(false);
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
                    mask={mask}
                />
            ))}
        </group>
    );
}

export default Content;
