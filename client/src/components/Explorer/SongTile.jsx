import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { useNavigate } from "react-router-dom";
import { artistsToString } from "../../utils";
import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NavigationContext } from "../../contexts/NavigationContext";

import Subtitle from "./Subtitle";

gsap.registerPlugin(useGSAP);

function SongTile({ position, size, song }) {
    const tile = useRef();
    let img = null;

    if(song.image) img = useLoader(TextureLoader, song.image.src);
    

    const navigate = useNavigate();
    const [pointerDownPos, setPointerDownPos] = useState(new Vector2(0, 0));

    const { focusCursor, unfocusCursor, isSongPageAnimating } =
        useContext(NavigationContext);

    //GSAP
    const { contextSafe } = useGSAP();

    const handleMouseEnter = contextSafe(() => {
        focusCursor();

        gsap.to(tile.current.scale, {
            x: size + 20,
            y: size + 20,
            duration: 0.3,
            ease: "power2",
        });
    });

    const handleMouseLeave = contextSafe(() => {
        unfocusCursor();

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

    const handlePointerUp = contextSafe((e) => {
        const currentPosition = new Vector2(e.clientX, e.clientY);

        if (
            currentPosition.distanceTo(pointerDownPos) > 5 ||
            isSongPageAnimating.current
        )
            return;

        unfocusCursor();
        navigate(`/explorer/${song.id}`, {
            state: { fromMain: true },
        });

        gsap.fromTo(
            tile.current.scale,
            {
                x: size + 20,
                y: size + 20,
            },
            {
                x: size + 10,
                y: size + 10,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
            }
        );
    });
    
    if (song) {
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
                    <meshBasicMaterial map={img}></meshBasicMaterial>
                </mesh>
                <Subtitle
                    tileSize={size}
                    position={[-0.5, -0.51, 1.1]}
                    title={song.name}
                    artist={artistsToString(song.artists)}
                />
            </group>
        );
    }
}

export default SongTile;
