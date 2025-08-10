import { createContext, useEffect, useState } from "react";

const initialValue = null;

const defaultPlaylistId = "2ksVm2FT5zhQFl8jmXRIzL";

const apiUrl = "http://localhost:3000";

export const SpotifyContext = createContext(initialValue);

export function SpotifyProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState([]);
    const [expiresAt, setExpiresAt] = useState(null);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [songs, setSongs] = useState(null);
    const [autoPlay,setAutoPlay] = useState(true);

    useEffect(() => {
        fetch(`${apiUrl}/get-token`, { method: "POST" })
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
        const previewSearches = [];
        const tracks = data.tracks.items;
        tracks.map((track, index) => {
            const newSong = track.track;
            newSongs[newSong.id] = newSong;

            if (newSong.album.images.length > 0) {
                // Preload each song's image
                const imageUrl = newSong.album.images[0].url; //get bigger image
                const img = new Image();
                img.src = imageUrl;
                newSongs[newSong.id].image = img;
            }

            // Add song to later search for its preview
            previewSearches.push({
                song: newSong.name,
                artist: newSong.artists[0].name,
            });
            const progress = Math.round(((index + 1) / tracks.length) * 100);

        });

        setSongs(newSongs);
    };

    // Fetch a list of song preview urls [{song:"",artist:""}, {...} ]
    // (Exceeds api calls really quickly)
    const fetchPreviewUrls = async (searches) => {
        if (!accessToken) return;

        try {
            const response = await fetch(`${apiUrl}/song-previews`, {
                method: "POST",
                body: JSON.stringify(searches),
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: "Bearer " + accessToken,
                },
            });
            const data = await response.json();
            console.log(data);
            return data || [];
        } catch (e) {
            console.error("Failed to fetch preview URLs:", e);
            return [];
        }
    };

    // Fetch a song's preview url by song or artists
    const fetchPreviewUrl = async (song, artist) => {
        if (!accessToken) return;

        if (!song || !artist) return;

        const params = new URLSearchParams({
            song: song,
            artist: artist,
        });

        try {
            const response = await fetch(
                `${apiUrl}/song-preview?${params.toString()}`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            return data || null;
        } catch (e) {
            console.error("Failed to fetch preview URLs:", e);
            return null;
        }
    };

    const setPreviewUrl = async (songID) => {
        let url = songs[songID].previewUrl;
        if (!url) {
            const response = await fetchPreviewUrl(
                songs[songID].name,
                songs[songID].artists[0].name
            );
            url = response.results[0].previewUrls[0];

            songs[songID].previewUrl = url;
        }
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
                setLoading,
                autoPlay,
                setAutoPlay,
                setPreviewUrl
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
}
