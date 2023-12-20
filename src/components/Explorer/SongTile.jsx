import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useNavigate } from "react-router-dom";

import { artistsToString } from "../../utils";
import Subtitle from "./Subtitle";

function SongTile({ position, size, song }) {
    const navigate = useNavigate();

    const img = useLoader(TextureLoader, song.metadata.thumbnail.imgix_url);

    const navigateToSong = () => {
        navigate(`/explorer/${song.id}`);
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
                artist={artistsToString(song.metadata.artist)}
            />
        </>
    );
}

export default SongTile;
