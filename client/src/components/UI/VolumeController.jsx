import { useContext, useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { MusicContext } from "../../contexts/MusicContext";
import { CursorContext } from "../../contexts/CursorContext";

import {
    VolumeOffIcon,
    LowVolumeIcon,
    MidVolumeIcon,
    HighVolumeIcon,
} from "../../Icons";

const getIcon = (percentage) => {
    if (percentage === 0) return <VolumeOffIcon />;
    if (percentage < 0.33) return <LowVolumeIcon />;
    if (percentage < 0.66) return <MidVolumeIcon />;
    return <HighVolumeIcon />;
};

const VolumeController = ({
    defaultVolume,
    maxVolume = 0.55,
    thumbMargin = 3,
    trackHeight = 93,
}) => {
    const trackRef = useRef();
    const thumbRef = useRef();
    const containerRef = useRef();
    const thumbY = useRef();

    const isDragging = useRef(false);
    const isCursorFocused = useRef(false);
    const closeWhenMouseUp = useRef(false);

    const volumePercentage = useRef(defaultVolume);
    const volumeBeforeMute = useRef(defaultVolume);
    const [icon, setIcon] = useState(() => getIcon(defaultVolume));

    const { focusCursor, unfocusCursor, colorsInverted } =
        useContext(CursorContext);
    const { setVolume } = useContext(MusicContext);

    // Cubic curve so the slider feels linear to the ear
    const getGain = (percentage) => Math.pow(percentage, 3) * maxVolume;

    // Always position against the full track height, not the animated one
    const getThumbY = (percentage) => {
        const thumbHeight = thumbRef.current.offsetHeight;
        return (
            (trackHeight - thumbHeight - thumbMargin * 2) * (1 - percentage) +
            thumbMargin
        );
    };

    // Place thumb at the default volume and create the quickTo for movement
    const { contextSafe } = useGSAP(() => {
        gsap.set(thumbRef.current, { y: getThumbY(defaultVolume) });
        thumbY.current = gsap.quickTo(thumbRef.current, "y", { duration: 0.2 });
    });

    useEffect(() => {
        setVolume(getGain(defaultVolume));
    }, []);

    const applyPercentage = (percentage) => {
        percentage = Math.max(0, Math.min(percentage, 1));
        volumePercentage.current = percentage;
        setVolume(getGain(percentage));
        setIcon(getIcon(percentage));
        thumbY.current?.(getThumbY(percentage));
    };

    const updateFromPointer = (clientY) => {
        const bounds = trackRef.current.getBoundingClientRect();
        if (bounds.height === 0) return;
        applyPercentage((bounds.bottom - clientY) / bounds.height);
    };

    const showSlider = contextSafe(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        // Extend container
        gsap.killTweensOf(container);
        gsap.to(container, {
            duration: 0.6,
            ease: "power3.inOut",
            height: "145px",
        });

        // Fade track in
        gsap.killTweensOf(track);
        gsap.to(track, {
            delay: 0.2,
            height: `${trackHeight}px`,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        });
    });

    // Collapse container and fade track out
    const hideSlider = contextSafe(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        gsap.killTweensOf(container);
        gsap.to(container, {
            duration: 0.6,
            ease: "power3.inOut",
            height: "40px",
        });

        gsap.killTweensOf(track);
        gsap.to(track, {
            duration: 0.2,
            height: "0",
            opacity: 0,
            ease: "power3.in",
        });
    });

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        updateFromPointer(e.clientY);
    };

    const handleMouseEnter = () => {
        closeWhenMouseUp.current = false;
        isCursorFocused.current = true;
        focusCursor();
        showSlider();
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            closeWhenMouseUp.current = true;
            return;
        }
        isCursorFocused.current = false;
        unfocusCursor();
        hideSlider();
    };

    const toggleMute = () => {
        if (volumePercentage.current === 0) {
            applyPercentage(Math.max(0.1, volumeBeforeMute.current));
        } else {
            volumeBeforeMute.current = volumePercentage.current;
            applyPercentage(0);
        }
    };

    // Dragging continues outside the slider, so listen on the document
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            updateFromPointer(e.clientY);
        };

        const handleMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;

            if (closeWhenMouseUp.current) {
                closeWhenMouseUp.current = false;
                isCursorFocused.current = false;
                unfocusCursor();
                hideSlider();
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (isCursorFocused.current) unfocusCursor();
        };
    }, []);

    return (
        <div
            className={`volume-controller ${colorsInverted && "inverted"}`}
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="volume-track-container">
                <div
                    className="volume-track"
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                >
                    <div className="volume-thumb" ref={thumbRef}></div>
                </div>
            </div>

            <div className="volume-state" onClick={toggleMute}>
                {icon}
            </div>
        </div>
    );
};

export default VolumeController;
