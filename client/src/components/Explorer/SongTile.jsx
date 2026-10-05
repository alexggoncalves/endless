import { useLoader } from "@react-three/fiber";
import { TextureLoader, Vector2 } from "three";
import { useNavigate } from "react-router-dom";

import { useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CursorContext } from "../../contexts/CursorContext";
import { MusicContext } from "../../contexts/MusicContext";
import { usePreview } from "../../contexts/PreviewContext";
import { ExplorerContext } from "../../contexts/ExplorerContext";

import Subtitle from "./Subtitle";
import fallbackImage from "../../assets/fallback_cover.png";

gsap.registerPlugin(useGSAP);

const COUNTDOWN_DURATION = 800;
const CLICK_MOVE_TOLERANCE = 5;
const LEAVE_WAIT_TIME = 150;

let countdownOwner = null;

function SongTile({ position, size, song, mask }) {
    const tile = useRef();
    const material = useRef();

    const isHovered = useRef(false);
    const previewUrlLoadPromise = useRef(null);
    const pointerDownPos = useRef(new Vector2());
    const leaveTimeout = useRef(null);
    const pressed = useRef(false);
    const press = useRef();

    const navigate = useNavigate();

    const {
        focusCursor,
        unfocusCursor,
        startCountdown,
        cancelCountdown,
        isMouseDown,
    } = useContext(CursorContext);
    const { songs } = useContext(MusicContext);
    const { isSongPageOpening, isSongPageClosing } = useContext(ExplorerContext);

    const preview = usePreview();
    const { autoPlay, findPreviewUrl } = preview;

    const { contextSafe } = useGSAP();

    // Always call the hook (rules of hooks); fall back if there's no album art
    const img = useLoader(
        TextureLoader,
        song.smallImage?.src ?? song.image?.src ?? fallbackImage,
    );

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

    const shouldPlay = () => isHovered.current || preview.isPinned(song.id);

    const playAudio = async () => {
        await previewUrlLoadPromise.current;
        if (!shouldPlay()) return;

        const url = songs[song.id]?.previewUrl;
        if (!url) return; // null or undefined: no preview available

        await preview.play(song.id, url, shouldPlay);
    };

    const handleMouseEnter = contextSafe(() => {
        if(isSongPageOpening.current) return;
        isHovered.current = true;

        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }

        gsap.to(tile.current.scale, {
            x: size + 20,
            y: size + 20,
            duration: 0.3,
            ease: "power2",
            overwrite: true,
        });

        previewUrlLoadPromise.current = findPreviewUrl(song.id);

        if(isMouseDown.current) return
        focusCursor(true);

        // Already playing, or already counting down for this tile -> leave it running
        if (
            !autoPlay ||
            preview.activeSongId === song.id ||
            countdownOwner === song.id
        )
            return;

        countdownOwner = song.id;
        startCountdown(COUNTDOWN_DURATION, () => {
            if (countdownOwner === song.id) countdownOwner = null;
            playAudio();
        });
    });

    const handleMouseLeave = contextSafe(() => {
        
        isHovered.current = false;
        pressed.current = false;
        unfocusCursor();

        if(isSongPageOpening.current) return;
        
        gsap.to(tile.current.scale, {
            x: size,
            y: size,
            duration: 0.4,
            ease: "power2",
            overwrite: true,
        });

        leaveTimeout.current = setTimeout(() => {
            leaveTimeout.current = null;
            cancelOwnCountdown();
            preview.release(song.id);
        }, LEAVE_WAIT_TIME);
    });

    const handlePointerDown = (e) => {
        pressed.current = true;
        pointerDownPos.current.set(e.clientX, e.clientY);
    };

    const handlePointerUp = contextSafe((e) => {
        if (!pressed.current) return;
        pressed.current = false;

        const dx = e.clientX - pointerDownPos.current.x;
        const dy = e.clientY - pointerDownPos.current.y;

        // Ignore drags and clicks during the song page animation
        if (
            Math.hypot(dx, dy) > CLICK_MOVE_TOLERANCE ||
            isSongPageOpening.current ||
            isSongPageClosing.current
        )
            return;

        unfocusCursor();

        // Pin the preview so it continues playing and navigate to the song page
        preview.pin(song.id);
        navigate(`/explorer/${song.id}`, {
            state: { fromMain: true },
        });

        // Animate tile when clicked
        gsap.to(press.current.scale, {
            x: 0.95,
            y: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            overwrite: true,
        });
    });

    const cancelOwnCountdown = () => {
        if (countdownOwner !== song.id) return;
        countdownOwner = null;
        cancelCountdown();
    };

    // If the tile is removed stop audio and release the cursor/countdown here
    useEffect(() => {
        return () => {
            clearTimeout(leaveTimeout.current);
            preview.release(song.id);
            cancelOwnCountdown();
            if (!isHovered.current) return;
            unfocusCursor();
        };
    }, []);

    return (
        <group
            ref={tile}
            scale={[size, size, 1]}
            position={[position.x, position.y, position.z]}
        >
            <group ref={press}>
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
        </group>
    );
}

export default SongTile;
