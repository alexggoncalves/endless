import "./explorer.css";

import { useEffect, useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Outlet } from "react-router-dom";
import { PerspectiveCamera } from "@react-three/drei";

import Content from "./Content";
import UserInteractionPrompt from "../Overlays/UserInteractionPrompt";
import VolumeController from "../UI/VolumeController";

import { ExplorerControlsProvider } from "../../contexts/ExplorerControlsContext";
import { MusicContext } from "../../contexts/MusicContext";
import PlaylistMenu from "../PlaylistMenu/PlaylistMenu";
import Overlay from "../Overlays/Overlay";
import PlaylistSearch from "../Overlays/PlaylistSearch";
import PlaylistSearchButton from "../UI/PlaylistSearchButton";

function Explorer() {
    const { getPlaylistInfo, accessToken, songs, currentPlaylist } =
        useContext(MusicContext);

    const [isUserPromptOpen, setUserPromptOpen] = useState(true);
    const [isPlaylistSearchOpen, setPlaylistSearchOpen] = useState(false);

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

            <PlaylistSearchButton
                callback={() => setPlaylistSearchOpen(true)}
            />

            {/* User interaction prompt */}
            <Overlay
                isOpen={isUserPromptOpen}
                onClose={() => setUserPromptOpen(false)}
            >
                {({ closeOverlay }) => (
                    <UserInteractionPrompt closeOverlay={closeOverlay} />
                )}
            </Overlay>

            {/* Playlist search */}
            <Overlay
                isOpen={isPlaylistSearchOpen}
                onClose={() => setPlaylistSearchOpen(false)}
            >
                {({ closeOverlay }) => (
                    <PlaylistSearch closeOverlay={closeOverlay} />
                )}
            </Overlay>

            {/* UI components */}
            <VolumeController defaultVolume={0.5} />
            <PlaylistMenu currentPlaylist={currentPlaylist}></PlaylistMenu>

            {/* Song page */}
            <Outlet />
        </>
    );
}

export default Explorer;
