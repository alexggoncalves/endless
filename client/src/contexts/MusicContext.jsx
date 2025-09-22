import { createContext, useEffect, useState } from "react";
import { artistsToString } from "./../utils.js";

const initialValue = null;

const defaultPlaylistId = "2ksVm2FT5zhQFl8jmXRIzL?si=e5d21c6c1ed944fd";

const apiUrl = "http://localhost:3000";

export const MusicContext = createContext(initialValue);

export function MusicProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState([]);
    const [expiresAt, setExpiresAt] = useState(null);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [songs, setSongs] = useState(null);
    const [autoPlay, setAutoPlay] = useState(true);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        fetch(`${apiUrl}/get-token`, { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                setAccessToken(data.access_token);
                setExpiresAt(Date.now() + data.expires_in * 1000);
            });
    }, []);

    const findPlaylist = async (playListId) => {
        const data = await requestPlaylist(playListId);

        if (data.error) {
            return null;
        }

        return data;
    };

    const setInitialPlaylist = async () => {
        const data = await requestPlaylist();

        if (data.error) {
            setPlaylist(null);
            return;
        }
        
        setPlaylist(data);
    };

    const requestPlaylist = async (playListId) => {
        if (!accessToken) return;
        if (!playListId) playListId = defaultPlaylistId;

        // Request for playlist info
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playListId}`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + accessToken },
            }
        );

        // Return playlist data
        return await response.json();
    };

    const setPlaylist = async (data) => {
        if (!data) return;
        
        // set current playlist to the data returned
        setCurrentPlaylist(data);

        const newSongs = {};
        const tracks = data.tracks.items;
        tracks.map((track, index) => {
            const newSong = track.track;
            if (newSong.id != null) {
                newSongs[newSong.id] = newSong;

                if (newSong.album.images.length > 0) {
                    // Preload each song's image
                    const bigUrl = newSong.album.images[0].url; //get bigger image
                    const smallUrl = newSong.album.images[1].url; //get smaller image
                    const bigImg = new Image();
                    const smallImg = new Image();
                    bigImg.src = bigUrl;
                    smallImg.src = smallUrl;
                    newSongs[newSong.id].image = bigImg;
                    newSongs[newSong.id].smallImage = smallImg;
                }

                // Parse artists to string
                newSongs[newSong.id].artistsString = artistsToString(
                    newSongs[newSong.id].artists
                );
            }
        });

        // Place all playlist's songs in the songs map 
        setSongs(newSongs);
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
        const song = songs[songID];
        let url = songs[songID].previewUrl;

        // If song already has a preview url (even null), do nothing
        if (song.previewUrl !== undefined) return;

        if (!url) {
            const response = await fetchPreviewUrl(
                songs[songID].name,
                songs[songID].artists[0].name
            );

            if (response.results) {
                songs[songID].previewUrl = response.results[0].previewUrls[0];
            } else {
                songs[songID].previewUrl = null;
            }
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
        <MusicContext.Provider
            value={{
                songs,
                // getPlaylistInfo,
                setInitialPlaylist,
                getSongById,
                accessToken,
                loading,
                setLoading,
                autoPlay,
                setAutoPlay,
                setPreviewUrl,
                setVolume,
                volume,
                currentPlaylist,
                findPlaylist,
                setPlaylist
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}
