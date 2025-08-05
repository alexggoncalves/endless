import "./explorer.css";

import { useEffect, useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import Content from "./Content";
import Loading from "../Loading";
import loadingGif from "./../../assets/icons8-loading.gif";

import { ExplorerControlsProvider } from "../../contexts/ExplorerControlsContext";
import { MusicContext } from "../../contexts/MusicContext";
import { SpotifyContext } from "../../contexts/SpotifyContext";

function Explorer() {
    const { loading, getAllSongs} = useContext(MusicContext);
    const { getPlaylistInfo, accessToken, songs } = useContext(SpotifyContext);

    const innerBounds = { x: 2600, y: 1500 },
        outerBounds = { x: 3000, y: 1900 },
        maxZ = 200;

    useEffect(() => {
        // if (songs.length == 0) getAllSongs();
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
            <Outlet />
            {loading ? <Loading loadingGif={loadingGif} /> : undefined}
        </>
    );
}

export default Explorer;
