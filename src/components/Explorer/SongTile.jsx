import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { createBucketClient } from "@cosmicjs/sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Subtitle from "./Subtitle";

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

async function getArtistByID(id) {
    const promise = await cosmic.objects.find({
        type: "artists",
        id: id,
    });
    return promise;
}

function SongTile({ position, size, song }) {
    const navigate = useNavigate();

    const [artist, setArtist] = useState("");

    const img = useLoader(TextureLoader, song.metadata.thumbnail.imgix_url);

    useEffect(() => {
        let output = "";
        for (let i = 0; i < song.metadata.artist.length; i++) {
            getArtistByID(song.metadata.artist[i]).then((response) => {
                const artists = response.objects;
                if (i == song.metadata.artist.length - 1) {
                    output += artists[0].title;
                } else output += artists[0].title + ", ";

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
