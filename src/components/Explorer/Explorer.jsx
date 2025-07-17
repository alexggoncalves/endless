import "./explorer.css";

import { useEffect, useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import Content from "./Content";
import { MusicContext } from "../../contexts/MusicContext";
import Loading from "../Loading";

import loadingGif from "./../../assets/icons8-loading.gif";
import { NavigationProvider } from "../../contexts/NavigationContext";

function Explorer() {
    const { loading, getAllSongs, songs } = useContext(MusicContext);

    useEffect(() => {
        if (songs.length == 0) getAllSongs();
    }, []);

    return (
        <>
            <div id="explorer">
                <Canvas id="canvas" flat linear>
                    <NavigationProvider>
                        <PerspectiveCamera
                            makeDefault
                            position={[0, 0, 1000]}
                            zoom={3}
                        />
                        <Content
                            songs={songs}
                            minTileSize={180}
                            maxTileSize={300}
                            minMargin={50}
                            boundSize={{x:2000, y: 1500, z: 200}}
                        />
                    </NavigationProvider>
                </Canvas>
            </div>
            <div id="radial-blur-mask" />
            <Outlet />
            {loading ? <Loading loadingGif={loadingGif} /> : undefined}
        </>
    );
}

export default Explorer;
