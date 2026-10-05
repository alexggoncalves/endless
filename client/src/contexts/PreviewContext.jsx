import {
    createContext,
    useState,
    useRef,
    useContext,
    useCallback,
    useEffect,
} from "react";
import { MusicContext } from "./MusicContext.jsx";

const initialValue = null;

export const PreviewContext = createContext(initialValue);
export const usePreview = () => useContext(PreviewContext);

export function PreviewProvider({ children }) {
    const [autoPlay, setAutoPlay] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const pendingPreviews = useRef({});

    const { songs, accessToken, apiUrl } = useContext(MusicContext);

    // -------- Preview URL lookup ---------

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
                },
            );
            const data = await response.json();
            return data || null;
        } catch (e) {
            console.error("Failed to fetch preview URLs:", e);
            return null;
        }
    };

    const findPreviewUrl = (songID) => {
        const song = songs[songID];
        if (song.previewUrl !== undefined) return Promise.resolve();

        return (pendingPreviews.current[songID] ??= fetchPreviewUrl(
            song.name,
            song.artists[0]?.name,
        )
            .then((res) => {
                song.previewUrl = res?.results?.[0]?.previewUrls?.[0] ?? null;
            })
            .finally(() => {
                delete pendingPreviews.current[songID];
            }));
    };

    // -------- Shared preview player ---------

    const audio = useRef(null);
    const playingId = useRef(null);
    const pinnedId = useRef(null);
    const volumeRef = useRef(volume);
    const [activeSongId, setActiveSongId] = useState(null);

    useEffect(() => {
        volumeRef.current = volume;
        if (audio.current) audio.current.volume = volume;
    }, [volume]);

    const destroyAudio = () => {
        const a = audio.current;
        if (a) {
            a.pause();
            a.src = "";
            a.load();
        }
        audio.current = null;
        playingId.current = null;
    };

    const stop = () => {
        destroyAudio();
        pinnedId.current = null;
        setActiveSongId(null);
    };

    const play = async (id, url) => {
        if (playingId.current === id && audio.current) return;

        destroyAudio();
        if (pinnedId.current !== id) pinnedId.current = null;

        // Create audio element
        const a = new Audio(url);
        a.volume = volumeRef.current;
        audio.current = a;
        playingId.current = id;
        setActiveSongId(id);

        // Stop playback when the song ends
        a.addEventListener("ended", () => {
            if (audio.current === a) stop();
        });

        try {
            await a.play();
        } catch (e) {
            if (audio.current === a) stop();
            console.warn("Preview playback failed:", e);
        }
    };

    const release = (id) => {
        if (playingId.current !== id || pinnedId.current === id) return;
        stop();
    };

    const pin = (id) => {
        if (playingId.current === id) pinnedId.current = id;
    };

    const unpin = (id) => {
        if (pinnedId.current === id) pinnedId.current = null;
    };

    const isPinned = (id) => pinnedId.current === id;

    const getAudio = () => audio.current;

    // Destroy audio when the component unmounts
    useEffect(() => {
        return () => {
            destroyAudio();
        };
    }, []);

    return (
        <PreviewContext.Provider
            value={{
                autoPlay,
                setAutoPlay,
                findPreviewUrl,
                setVolume,
                volume,
                activeSongId,
                stop,
                play,
                release,
                pin,
                unpin,
                isPinned,
                getAudio,
            }}
        >
            {children}
        </PreviewContext.Provider>
    );
}
