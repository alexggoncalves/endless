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

    const [isUserPromptOpen, setUserPromptOpen] = useState(true);
    const [isPlaylistSearchOpen, setPlaylistSearchOpen] = useState(false);

    useEffect(() => {
        if (accessToken && !songs) {
            setInitialPlaylist();
        }
    }, [accessToken]);

    return (
        <>
            <Explorer></Explorer>

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
            <PlaylistMenu currentPlaylist={currentPlaylist}>
                <PlaylistSearchButton
                    callback={() => setPlaylistSearchOpen(true)}
                    isOpen={isPlaylistSearchOpen}
                />
            </PlaylistMenu>

            {/* Song page */}
            <Outlet />
        </>
    );
}

export default App;
