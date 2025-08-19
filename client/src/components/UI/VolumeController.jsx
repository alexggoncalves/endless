import { useContext, useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { MusicContext } from "../../contexts/MusicContext";

import mute from "../../assets/mute.svg";
import low from "../../assets/low.svg";
import down from "../../assets/down.svg";
import up from "../../assets/up.svg";
import { NavigationContext } from "../../contexts/NavigationContext";

const VolumeController = ({
    defaultVolume,
    maxVolume = 0.55,
    thumbMargin = 3,
    trackHeight = 93,
}) => {
    const trackRef = useRef();
    const thumbRef = useRef();
    const containerRef = useRef();

    const isDragging = useRef();

    const volumePercentage = useRef(defaultVolume);
    const volumeBeforeMute = useRef(defaultVolume);

    const closeWhenMouseUp = useRef(false);

    const getLogGain = (value) => {
        const gain = Math.pow(value, 3) * maxVolume;
        return gain;
    };

    const { focusCursor, unfocusCursor } = useContext(NavigationContext);
    const { volume, setVolume } = useContext(MusicContext);
    const { contextSafe } = useGSAP();

    // Create quick to function for thumb movement
    const thumbY = useRef();
    useEffect(() => {
        thumbY.current = gsap.quickTo(thumbRef.current, "y", { duration: 0.2 });
    }, []);

    const updateVolume = (clientY) => {
        const track = trackRef.current;
        const thumb = thumbRef.current;

        if (!track || !thumb) return;

        const bounds = track.getBoundingClientRect();
        let percentage = (bounds.bottom - clientY) / bounds.height;
        percentage = Math.max(0, Math.min(percentage, 1));
        setVolume(getLogGain(percentage));
        volumePercentage.current = percentage;

        const thumbWidth = thumb.getBoundingClientRect().height;

        const thumbPosition =
            (bounds.height - thumbWidth - thumbMargin * 2) * (1 - percentage) +
            thumbMargin;
        thumbY.current(thumbPosition);
    };

    const updateVolumePercentage = (percentage) => {
        const thumb = thumbRef.current;
        const track = trackRef.current;

        percentage = Math.max(0, Math.min(percentage, 1));
        setVolume(getLogGain(percentage));
        volumePercentage.current = percentage;

        const thumbWidth = thumb.getBoundingClientRect().height;

        const bounds = track.getBoundingClientRect();
        const thumbPosition =
            (bounds.height - thumbWidth - thumbMargin * 2) * (1 - percentage) +
            thumbMargin;
        thumbY.current(thumbPosition);
    };

    const getVolumeIcon = () => {
        if (volumePercentage.current === 0) return mute;
        if (volumePercentage.current < 0.33) return low;
        if (volumePercentage.current < 0.66) return down;
        return up;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        updateVolume(e.clientY);
    };

    const handleMouseEnter = contextSafe(() => {
        focusCursor();
        showSlider();
    });

    const handleMouseLeave = () => {
        if (isDragging.current) {
            closeWhenMouseUp.current = true;
            return;
        }
        unfocusCursor();
        hideSlider();
    };

    const showSlider = contextSafe(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!container || !thumb || !track) return;

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

    // Slide song page out and navigate to explorer
    const hideSlider = contextSafe(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;

        if (!container || !thumb || !track) return;

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

    useEffect(() => {
        const handleMouseUp = () => {
            isDragging.current = false;
            if (closeWhenMouseUp.current) {
                unfocusCursor();
                hideSlider();
                closeWhenMouseUp.current = false;
            }
        };

        const handleMouseMove = (e) => {
            e.preventDefault();
            if (isDragging.current) {
                updateVolume(e.clientY);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const toggleMute = () => {
        if (volumePercentage.current === 0) {
            const newVolume = Math.max(0.1, volumeBeforeMute.current);
            updateVolumePercentage(newVolume);
        } else {
            // mute
            volumeBeforeMute.current = volumePercentage.current;
            updateVolumePercentage(0);
        }
    };

    useEffect(() => {
        setVolume(getLogGain(defaultVolume));

        const track = trackRef.current;
        const thumb = thumbRef.current;

        if (!track || !thumb) return;
        // const trackHeight = track.clientHeight;
        const thumbWidth = thumb.getBoundingClientRect().height;
        const thumbY =
            (1 - defaultVolume) * (trackHeight - thumbWidth - thumbMargin * 2) +
            thumbMargin;
        gsap.set(thumb, { y: thumbY });
    }, [defaultVolume, setVolume]);

    return (
        <div
            className="volume-controller"
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
                <img src={getVolumeIcon()} alt="" />
            </div>
        </div>
    );
};

export default VolumeController;
