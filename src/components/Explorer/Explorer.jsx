import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import "./explorer.css";

import Content from "./Content";
import InputController from "./InputController";
import { useContext } from "react";
import { MusicContext } from "../../contexts/MusicContext";
import Loading from "../Loading";
import Header from "../Header";

import loadingGif from "./../../assets/icons8-loading.gif";

function Explorer() {
    const { loading } = useContext(MusicContext);

    return (
        <>
            <div id="explorer">
                <Canvas id="canvas" flat linear>
                    <PerspectiveCamera makeDefault position={[0, 0, 1000]} />
                    <ambientLight intensity={20} />
                    <InputController>
                        <Content />
                    </InputController>
                </Canvas>
            </div>
            <div id="radial-blur-mask" />
            <Outlet />
            {loading ? <Loading loadingGif={loadingGif} /> : undefined}
        </>
    );
}

export default Explorer;
