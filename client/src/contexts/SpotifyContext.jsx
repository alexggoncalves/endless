import { createContext, useEffect, useState } from "react";

const initialValue = null;

const tokenURL = "http://localhost:3000/get-token";
const defaultPlaylistId = "2ksVm2FT5zhQFl8jmXRIzL";

export const SpotifyContext = createContext(initialValue);

export function SpotifyProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState([]);
    const [expiresAt, setExpiresAt] = useState(null);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [songs, setSongs] = useState(null);

    useEffect(() => {
        fetch(tokenURL, { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                setAccessToken(data.access_token);
                setExpiresAt(Date.now() + data.expires_in * 1000);
            });
    }, []);

    const getPlaylistInfo = async (playListId) => {
        if (!accessToken) return;
        if (!playListId) playListId = defaultPlaylistId;

        setLoading(true);

        // Request for playlist info
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playListId}`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken },
            }
        );

        // Set current playlist to the data returned
        const data = await response.json();
        setCurrentPlaylist(data);

        // Save each playlist track in the songs map
        const newSongs = {};
        const tracks = data.tracks.items;
        tracks.map((track, index) => {
            const newSong = track.track;
            newSongs[newSong.id] = newSong;
            if (newSong.album.images.length > 0) {
                const imageUrl = newSong.album.images[0].url; //get bigger image

                const img = new Image();
                img.src = imageUrl;
                newSongs[newSong.id].image = img;
            }
        });
        setSongs(newSongs);
        setLoading(false);
    };

    const getSongById = async (songId) => {
        if (!accessToken) return;

        const response = await fetch(
            `https://api.spotify.com/v1/tracks/${songId}`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken },
            }
        );

        return await response.json();
    };

    return (
        <SpotifyContext.Provider
            value={{
                songs,
                getPlaylistInfo,
                getSongById,
                accessToken,
                loading,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
}
