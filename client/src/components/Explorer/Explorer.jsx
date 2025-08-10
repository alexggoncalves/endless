import "./explorer.css";

import { useEffect, useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import Content from "./Content";
import UserInteractionPrompt from "../UserInteractionPrompt/UserInteractionPrompt";

import { ExplorerControlsProvider } from "../../contexts/ExplorerControlsContext";
import { SpotifyContext } from "../../contexts/SpotifyContext";


function Explorer() {
    const { getPlaylistInfo, accessToken, songs, loading } = useContext(SpotifyContext);

    const innerBounds = { x: 2600, y: 1500 },
        outerBounds = { x: 3000, y: 1900 },
        maxZ = 200;

    useEffect(() => {
        if (accessToken && !songs) {
            getPlaylistInfo()
        }
    }, [accessToken]);

    return (
        <>
            <div id="explorer">
                <Canvas id="canvas" flat linear>
                    <ExplorerControlsProvider>
                        <PerspectiveCamera
                            makeDefault
                            position={[0, 0, 2000]}
                            zoom={3}
                        />
                        <Content
                            songs={songs}
                            minTileSize={180}
                            maxTileSize={300}
                            minMargin={50}
                            innerBounds={innerBounds}
                            maxZ={maxZ}
                            outerBounds={outerBounds}
                        />
                    </ExplorerControlsProvider>
                </Canvas>
            </div>
            <div id="radial-blur-mask" />

            <UserInteractionPrompt/>

            <Outlet />
        </>
    );
}

export default Explorer;
