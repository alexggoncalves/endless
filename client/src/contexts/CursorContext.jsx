import { createContext, useRef, useEffect, useState } from "react";

import CountdownCircle, { CIRCUMFERENCE } from "../components/UI/CountdownCircle";

export const CursorContext = createContext(null);

export function CursorProvider({ children }) {
    const pointCursorWrapper = useRef();
    const invertCircleWrapper = useRef();
    const invertCircle = useRef();
    const countdownPath = useRef();

    const countdownFrame = useRef(null);
    const isMouseDown = useRef(false);

    // Cursor movement + eased circle
    useEffect(() => {
        const pos = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        let frame;

        const tick = () => {
            const ease = isMouseDown.current ? 0.4 : 0.1;
            pos.x += (target.x - pos.x) * ease;
            pos.y += (target.y - pos.y) * ease;
            invertCircleWrapper.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            frame = requestAnimationFrame(tick);
        };

        const onMove = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
            pointCursorWrapper.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        };

        frame = requestAnimationFrame(tick);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("wheel", onMove);

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(countdownFrame.current);
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("wheel", onMove);
        };
    }, []);

    // Circle scaling on hover
    const focusCursor = (isSongTile = false) => {
        invertCircle.current.style.transform = `scale(${isSongTile ? 0.45 : 0.64})`;
    };
    const unfocusCursor = () => {
        invertCircle.current.style.transform = `scale(1)`;
    };

    // Preview countdown circle
    const setCountdownProgress = (progress) => {
        const path = countdownPath.current;
        if (!path) return;
        path.setAttribute("stroke-dashoffset", CIRCUMFERENCE * (1 - progress));
        path.setAttribute("opacity", progress > 0 ? 1 : 0);
    };

    const cancelCountdown = () => {
        cancelAnimationFrame(countdownFrame.current);
        countdownFrame.current = null;
        setCountdownProgress(0);
    };

    const startCountdown = (duration, onComplete) => {
        cancelCountdown();
        if (duration <= 0) return;

        const startTime = performance.now();
        const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setCountdownProgress(progress);
            if (progress < 1) {
                countdownFrame.current = requestAnimationFrame(update);
            } else {
                countdownFrame.current = null;
                onComplete?.();
            }
        };
        countdownFrame.current = requestAnimationFrame(update);
    };

    return (
        <CursorContext.Provider
            value={{
                isMouseDown,
                startCountdown,
                cancelCountdown,
                focusCursor,
                unfocusCursor,
            }}
        >
            {children}
            <div ref={pointCursorWrapper} className="point-cursor-wrapper">
                <div className="point-cursor"></div>
            </div>
            <div ref={invertCircleWrapper} className="invert-circle-wrapper">
                <div ref={invertCircle} className="invert-circle"></div>
                <CountdownCircle pathRef={countdownPath} />
            </div>
        </CursorContext.Provider>
    );
}