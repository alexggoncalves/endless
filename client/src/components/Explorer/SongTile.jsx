import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { useNavigate } from "react-router-dom";

import { memo, useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CursorContext } from "../../contexts/CursorContext";
import { MusicContext } from "../../contexts/MusicContext";

import Subtitle from "./Subtitle";
import PlaybackState from "./PlaybackState";

gsap.registerPlugin(useGSAP);

const COUNTDOWN_DURATION = 600;
const CLICK_MOVE_TOLERANCE = 5;

// 1x1 dark grey pixel, used when a song has no album art
const FALLBACK_IMAGE =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGMwNjYGAAE2AJp53qClAAAAAElFTkSuQmCC";

function SongTile({ position, size, song, mask }) {
    const audio = useRef(null);
    const tile = useRef();
    const material = useRef();

    const isHovered = useRef(false);
    const previewUrlLoadPromise = useRef(null);
    const pointerDownPos = useRef(new Vector2());

    const navigate = useNavigate();
    const {
        focusCursor,
        unfocusCursor,
        isSongPageAnimating,
        startCountdown,
        cancelCountdown,
    } = useContext(CursorContext);

    const { autoPlay, setPreviewUrl, songs, volume } = useContext(MusicContext);

    const { contextSafe } = useGSAP();

    // Always call the hook (rules of hooks); fall back if there's no album art
    const img = useLoader(
        TextureLoader,
        song.smallImage?.src ?? song.image?.src ?? FALLBACK_IMAGE,
    );

    const stopAudio = () => {
        if (!audio.current) return;
        audio.current.pause();
        audio.current = null;
    };

    // If the tile is removed stop audio and release the cursor/countdown here
    useEffect(() => {
        return () => {
            stopAudio();
            if (!isHovered.current) return;
            unfocusCursor();
            cancelCountdown();
        };
    }, []);

    // Keep volume in sync if it changes while a preview is playing
    useEffect(() => {
        if (audio.current) audio.current.volume = volume;
    }, [volume]);

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
        { dependencies: [] },
    );

    const playAudio = async () => {
        let a = null;
        try {
            await previewUrlLoadPromise.current;

            // Pointer may have left while the preview url was loading
            if (!isHovered.current) return;

            const url = songs[song.id]?.previewUrl;
            if (!url) return; // null or undefined: no preview available

            stopAudio();
            a = new Audio(url);
            a.volume = volume;
            audio.current = a;

            await new Promise((resolve, reject) => {
                a.addEventListener("canplaythrough", resolve, { once: true });
                a.addEventListener("error", reject, { once: true });
            });

            // Pointer left, or another playback started, while loading
            if (audio.current !== a || !isHovered.current) return;

            await a.play();
        } catch (e) {
            if (a && audio.current === a) audio.current = null;
            console.warn("Preview playback failed:", e);
        }
    };

    const handleMouseEnter = contextSafe(() => {
        isHovered.current = true;
        focusCursor(true);

        gsap.to(tile.current.scale, {
            x: size + 20,
            y: size + 20,
            duration: 0.3,
            ease: "power2",
        });

        previewUrlLoadPromise.current = setPreviewUrl(song.id);

        if (autoPlay) startCountdown(COUNTDOWN_DURATION, playAudio);
    });

    const handleMouseLeave = contextSafe(() => {
        isHovered.current = false;
        unfocusCursor();

        gsap.to(tile.current.scale, {
            x: size,
            y: size,
            duration: 0.4,
            ease: "power2",
        });

        cancelCountdown();
        stopAudio();
    });

    const handlePointerDown = (e) => {
        pointerDownPos.current.set(e.clientX, e.clientY);
    };

    const handlePointerUp = contextSafe((e) => {
        const dx = e.clientX - pointerDownPos.current.x;
        const dy = e.clientY - pointerDownPos.current.y;

        // Ignore drags and clicks during the song page animation
        if (
            Math.hypot(dx, dy) > CLICK_MOVE_TOLERANCE ||
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
            },
        );
    });

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
                <planeGeometry />
                <meshBasicMaterial
                    ref={material}
                    transparent
                    opacity={1}
                    map={img}
                    alphaMap={mask}
                />
            </mesh>
            <Subtitle
                tileSize={size}
                position={[-0.5, -0.51, 1.1]}
                title={song.name}
                artist={songs[song.id]?.artistsString ?? song.artistsString}
            />
        </group>
    );
}

export default SongTile;
