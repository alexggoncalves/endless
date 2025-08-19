import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useMemo } from "react";
import { ShapeGeometry } from "three";
import { Html } from "@react-three/drei";

import playSVG from "./../../assets/play.svg";
import stopSVG from "./../../assets/stop.svg";

function PlaybackState({ position, tileScale }) {
    const playStateRef = useRef();

    const explorerElement = useMemo(() => document.getElementById('root'), []);

    if (!explorerElement) return null; // or fallback UI

    return (
        <>
            <Html occlude position={position} wrapperClass="playback-state" zIndexRange={[4,2]}>
                <img
                    src={playSVG}
                    width={"50px"}
                    height={"50px"}
                />
            </Html>
        </>
    );
}

export default PlaybackState;
