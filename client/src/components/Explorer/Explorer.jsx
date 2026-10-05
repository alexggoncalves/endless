import "./explorer.css";

import { useEffect, useContext } from "react";
import { Canvas } from "@react-three/fiber";

import Content from "./Content";

import { CameraProvider } from "../../contexts/CameraContext";
import { MusicContext } from "../../contexts/MusicContext";

const innerBounds = { x: 2600, y: 1500 },
    outerBounds = { x: 3000, y: 1900 },
    maxZ = 200;

function Explorer() {
    const { setInitialPlaylist, accessToken, songs, currentPlaylist } =
        useContext(MusicContext);

    useEffect(() => {
        if (accessToken && !songs) {
            setInitialPlaylist();
        }
    }, [accessToken]);

    return (
        <>
            <div id="explorer">
                <Canvas
                    id="canvas"
                    flat
                    dpr={1}
                    camera={{
                        position: [0, 0, 1000],
                        fov: 75,
                        near: 1,
                        far: 5000,
                    }}
                >
                    <CameraProvider>
                        <Content
                            key={currentPlaylist?.id}
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
                    </CameraProvider>
                </Canvas>
            </div>

            <div id="radial-blur-mask" />
        </>
    );
}

export default Explorer;
