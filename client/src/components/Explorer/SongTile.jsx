import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { useNavigate } from "react-router-dom";

import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NavigationContext } from "../../contexts/NavigationContext";
import { MusicContext } from "../../contexts/MusicContext";

import Subtitle from "./Subtitle";
import PlaybackState from "./PlaybackState";

gsap.registerPlugin(useGSAP);

const COUNTDOWN_DURATION = 600;

function SongTile({ position, size, song, mask }) {
    const audio = useRef();
    const tile = useRef();
    const material = useRef();

    const navigate = useNavigate();
    const [pointerDownPos, setPointerDownPos] = useState(new Vector2(0, 0));
    const {
        focusCursor,
        unfocusCursor,
        isSongPageAnimating,
        startCountdown,
        cancelCountdown,
    } = useContext(NavigationContext);

    const { autoPlay, setPreviewUrl, songs, volume } = useContext(MusicContext);
    //GSAP
    const { contextSafe } = useGSAP();

    // Convert image into texture
    let img = null;
    if (song.image) img = useLoader(TextureLoader, song.image.src);

    let previewUrlLoadPromise = null;

    // Fade tile in
    useGSAP(
        () => {
            if (!tile.current || !material.current) return;
            gsap.from(tile.current.scale, {
                x: 0,
                y: 0,
                ease: "power3.out",
                duration: 1,
            });

            gsap.from(material.current, {
                opacity: 0,
                ease: "power3.out",
                duration: 1,
            });
        },
        { dependencies: [] }
    );

    const handleMouseEnter = contextSafe(async () => {
        focusCursor(true);

        gsap.to(tile.current.scale, {
            x: size + 20,
            y: size + 20,
            duration: 0.3,
            ease: "power2",
        });

        previewUrlLoadPromise = setPreviewUrl(song.id);

        if (autoPlay) playAfterCountdown();
    });

    const playAfterCountdown = () => {
        startCountdown(COUNTDOWN_DURATION, async () => {
            await previewUrlLoadPromise;
            await playAudio();
        });
    };

    const playAudio = async () => {
        const url = songs[song.id].previewUrl;

        if (url === null) return;

        if (audio.current) {
            audio.current.pause();
            audio.current = null;
        }

        audio.current = new Audio(url);
        audio.current.volume = volume;

        await new Promise((resolve, reject) => {
            audio.current.addEventListener("canplaythrough", resolve, {
                once: true,
            });
            audio.current.addEventListener("error", reject, { once: true });
        });

        if (audio.current === null) return;

        await audio.current.play();
    };

    const handleMouseLeave = contextSafe(() => {
        unfocusCursor();

        gsap.to(tile.current.scale, {
            x: size,
            y: size,
            duration: 0.4,
            ease: "power2",
        });

        cancelCountdown();

        if (!autoPlay) return;

        if (audio.current) {
            audio.current.pause();
            audio.current = null;
        }
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

    useEffect(() => {
        if (audio.current) {
            console.log(audio.current)
        }
    }, [volume]);

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
                    <meshBasicMaterial
                        transparent={true}
                        opacity={1}
                        ref={material}
                        map={img}
                        alphaMap={mask}
                    ></meshBasicMaterial>
                </mesh>
                <Subtitle
                    tileSize={size}
                    position={[-0.5, -0.51, 1.1]}
                    title={song.name}
                    artist={songs[song.id].artistsString}
                />
                {/* <PlaybackState position={[-0.45, 0.45, 1]} tileScale={size}></PlaybackState> */}
            </group>
        );
    }
}

export default SongTile;
