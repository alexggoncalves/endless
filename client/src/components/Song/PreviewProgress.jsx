import { useContext, useEffect, useRef, useState } from "react";
import { usePreview } from "../../contexts/PreviewContext.jsx";
import { MusicContext } from "../../contexts/MusicContext.jsx";
import { CursorContext } from "../../contexts/CursorContext.jsx";

import { PlayIcon, StopIcon } from "../UI/Icons.jsx";

const STROKE = 6;
const r = 25;
const size = 2 * (r + STROKE / 2);
const CIRCUMFERENCE = 2 * Math.PI * r;

const startAngle = (90 * Math.PI) / 180;
const dx = r * Math.cos(startAngle);
const dy = -r * Math.sin(startAngle);

const CIRCLE_PATH = `M ${size / 2} ${size / 2} m ${dx} ${dy}
    a ${r} ${r} 0 1 1 ${-dx * 2} ${-dy * 2}
    a ${r} ${r} 0 1 1 ${dx * 2} ${dy * 2}`;

function SongProgress({ songId }) {
    const preview = usePreview();
    const { activeSongId, getAudio, findPreviewUrl } = preview;
    const { songs } = useContext(MusicContext);
    const { focusCursor, unfocusCursor } = useContext(CursorContext);

    const ring = useRef(null);
    const [hasPreview, setHasPreview] = useState(false);
    const isActive = activeSongId === songId;

    // Look up the preview url up front, so the button knows if there's anything to play
    useEffect(() => {
        if (!songs?.[songId]) return;
        let cancelled = false;
        findPreviewUrl(songId).then(() => {
            if (!cancelled) setHasPreview(!!songs[songId]?.previewUrl);
        });
        return () => {
            cancelled = true;
        };
    }, [songId]);

    useEffect(() => {
        // Not playing: show the empty ring
        if (!isActive) {
            if (ring.current)
                ring.current.style.strokeDashoffset = CIRCUMFERENCE;
            return;
        }

        let raf;
        const tick = () => {
            const a = getAudio();
            if (a && a.duration && ring.current) {
                const p = a.currentTime / a.duration;
                ring.current.style.strokeDashoffset = CIRCUMFERENCE * (1 - p);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isActive, getAudio]);

    const toggle = () => {
        if (isActive) return preview.stop();

        const url = songs?.[songId]?.previewUrl;
        if (!url) return;

        preview.play(songId, url);
        preview.pin(songId);
    };

    return (
        <button
            className="song-progress"
            onClick={toggle}
            disabled={!hasPreview}
            aria-label={isActive ? "Stop preview" : "Play preview"}
            onMouseEnter={() => hasPreview && focusCursor()}
            onMouseLeave={unfocusCursor}
        >
            <svg className="song-progress_ring" viewBox={`0 0 ${size} ${size}`}>
                <path
                    d={CIRCLE_PATH}
                    fill="none"
                    stroke="#303030"
                    strokeOpacity="0.3"
                    strokeWidth={STROKE}
                />
                <path
                    ref={ring}
                    d={CIRCLE_PATH}
                    fill="none"
                    stroke="#303030"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE}
                />
            </svg>
            <span className="song-progress_icon">
                {isActive ? <StopIcon /> : <PlayIcon />}
            </span>
        </button>
    );
}

export default SongProgress;
