import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

import { artistsToString } from "../../utils";
import Subtitle from "./Subtitle";

function SongTile({ position, size, song }) {
    const tile = useRef();

    const navigate = useNavigate();
    const [pointerDownPos, setPointerDownPos] = useState(new Vector2(0, 0));

    const img = useLoader(TextureLoader, song.metadata.thumbnail.imgix_url);

    const explorer = document.querySelector("#explorer");

    //GSAP
    const { contextSafe } = useGSAP();

    const handleMouseEnter = contextSafe(() => {
        explorer.classList.add("pointer");

        gsap.to(tile.current.scale, {
            x: size + 20,
            y: size + 20,
            duration: 0.3,
            ease: "power2",
        });
    });


    const handleMouseLeave = contextSafe(() => {
        explorer.classList.remove("pointer");

        gsap.to(tile.current.scale, {
            x: size,
            y: size,
            duration: 0.4,
            ease: "power2",
        });
    });

    const handlePointerDown = (e) => {
        setPointerDownPos(new Vector2(e.clientX, e.clientY));
    };

    const handlePointerUp = (e) => {
        const currentPosition = new Vector2(e.clientX, e.clientY);
        if (currentPosition.distanceTo(pointerDownPos) <= 5) {
            navigate(`/explorer/${song.id}`, { state: { fromMain: true } });
        }
    };

    return (
        <group
            ref={tile}
            scale={[size, size, 1]}
            position={[position.x, position.y, position.z]}
        >
            <mesh
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerEnter={handleMouseEnter}
                onPointerLeave={handleMouseLeave}
            >
                <planeGeometry></planeGeometry>
                <meshBasicMaterial
                    map={img}
                ></meshBasicMaterial>
            </mesh>
            <Subtitle
                tileSize={size}
                position={[-0.5, -0.51, 1.1]}
                title={song.title}
                artist={artistsToString(song.metadata.artist)}
            />
        </group>
    );
}

export default SongTile;
