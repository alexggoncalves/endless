import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useRef, useState } from "react";

import Content from "./Content";
import InputController from "./InputController";

function Explorer() {
    return (
        <>
            <div id="explorer">
                <Canvas id="canvas">
                    <OrthographicCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={6} />
                    <InputController>
                        <Content />
                    </InputController>
                </Canvas>
            </div>
            <div id="radial-blur-mask" />
        </>
    );
}

export default Explorer;
