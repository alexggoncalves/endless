import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArtistByID } from "../apiService.js";

import Subtitle from "./Subtitle";

function SongTile({ position, size, song }) {
    const [artist, setArtist] = useState("");
    const navigate = useNavigate();
    
    const img = useLoader(TextureLoader, song.metadata.thumbnail.imgix_url);

    useEffect(() => {
        let output = "";
        for (let i = 0; i < song.metadata.artist.length; i++) {
            getArtistByID(song.metadata.artist[i]).then((artist) => {
                if (i == song.metadata.artist.length - 1) {
                    output += artist.title;
                } else output += artist.title + ", ";

                setArtist(output);
            });
        }
    }, []);

    const navigateToSong = () => {
        navigate(`/song/${song.id}`);
    };

    return (
        <>
            <mesh
                scale={[size, size, 1]}
                position={[position.x, position.y, 1]}
                onClick={navigateToSong}
            >
                <planeGeometry></planeGeometry>
                <meshBasicMaterial map={img}></meshBasicMaterial>
            </mesh>
            <Subtitle
                position={[position.x - size / 2, position.y - size / 2, 1.1]}
                title={song.title}
                artist={artist}
            />
        </>
    );
}

export default SongTile;
