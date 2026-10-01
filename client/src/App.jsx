import { useEffect, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import UserInteractionPrompt from "./components/Overlays/UserInteractionPrompt";
import VolumeController from "./components/UI/VolumeController";

import { MusicContext } from "./contexts/MusicContext";
import PlaylistMenu from "./components/PlaylistMenu/PlaylistMenu";
import Overlay from "./components/Overlays/Overlay";
import PlaylistSearch from "./components/Overlays/PlaylistSearch";
import PlaylistSearchButton from "./components/UI/PlaylistSearchButton";
import Explorer from "./components/Explorer/Explorer";

function App() {
    const { setInitialPlaylist, accessToken, songs, currentPlaylist } =
        useContext(MusicContext);

    const [overlayView, setOverlayView] = useState("intro"); // null | "intro" | "playlist"

    useEffect(() => {
        if (accessToken && !songs) {
            setInitialPlaylist();
        }
    }, [accessToken]);

    return (
        <>
            <Explorer></Explorer>

            {/* Overlays */}
            <Overlay
                view={overlayView}
                onClose={() => setOverlayView(null)}
                views={{
                    intro: ({ closeOverlay }) => (
                        <UserInteractionPrompt closeOverlay={closeOverlay} />
                    ),
                    playlist: ({ closeOverlay }) => (
                        <PlaylistSearch closeOverlay={closeOverlay} />
                    ),
                }}
            />

            {/* Volume Controller*/}
            <VolumeController defaultVolume={0.5} />

            {/* Playlist Menu */}
            <PlaylistMenu currentPlaylist={currentPlaylist}>
                <PlaylistSearchButton
                    callback={() => setOverlayView("playlist")}
                    isOpen={overlayView === "playlist"}
                />
            </PlaylistMenu>

            {/* Song page */}
            <Outlet />
        </>
    );
}

export default App;
