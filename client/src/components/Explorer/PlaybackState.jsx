import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useMemo } from "react";
import { ShapeGeometry } from "three";
import { Html } from "@react-three/drei";

import playSVG from "./../../assets/play.svg";
import stopSVG from "./../../assets/stop.svg";

import play from "./../../assets/play.png";

function PlaybackState({ position, tileScale }) {
    const playStateRef = useRef();

    const explorerElement = useMemo(() => document.getElementById('root'), []);

    if (!explorerElement) return null;

    return (
        <>
            <Html occlude position={position} wrapperClass="playback-state" zIndexRange={[2,2]}>
                <img
                    src={play}
                    width={"50px"}
                    height={"50px"}
                />
            </Html>
        </>
    );
}

export default PlaybackState;
