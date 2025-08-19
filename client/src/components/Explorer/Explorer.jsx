import "./explorer.css";

import { useEffect, useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import Content from "./Content";
import UserInteractionPrompt from "../UserInteractionPrompt/UserInteractionPrompt";
import VolumeController from "../UI/VolumeController";

import { ExplorerControlsProvider } from "../../contexts/ExplorerControlsContext";
import { MusicContext } from "../../contexts/MusicContext";
import PlaylistMenu from "../PlaylistMenu/PlaylistMenu";

function Explorer() {
    const { getPlaylistInfo, accessToken, songs, currentPlaylist } =
        useContext(MusicContext);

    const innerBounds = { x: 2600, y: 1500 },
        outerBounds = { x: 3000, y: 1900 },
        maxZ = 200;

    useEffect(() => {
        if (accessToken && !songs) {
            getPlaylistInfo();
        }
    }, [accessToken]);

    return (
        <>
            <div id="explorer">
                <Canvas id="canvas" flat shadows={false} dpr={[1, 1]}>
                    <ExplorerControlsProvider>
                        <PerspectiveCamera
                            makeDefault
                            position={[0, 0, 2000]}
                            zoom={3}
                        />
                        <Content
                            songs={songs}
                            minTileSize={140}
                            maxTileSize={300}
                            minMargin={100}
                            innerBounds={innerBounds}
                            maxZ={maxZ}
                            outerBounds={outerBounds}
                            amount={18}
                            maxEqualTileDistance={2000}
                        />
                    </ExplorerControlsProvider>
                </Canvas>
            </div>
            <div id="radial-blur-mask" />

            <UserInteractionPrompt />

            <VolumeController defaultVolume={0.5} />

            <PlaylistMenu currentPlaylist={currentPlaylist} />

            {/* Song page */}
            <Outlet />
        </>
    );
}

export default Explorer;
