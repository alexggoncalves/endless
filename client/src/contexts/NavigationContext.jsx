import { createContext, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import CountdownCircle from "./../components/CountdownCircle";

export const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
    const pointCursor = useRef();
    const invertCircle = useRef();
    const pointCursorWrapper = useRef();
    const invertCircleWrapper = useRef();
    const logoRef = useRef();

    const [countdownProgress, setCountdownProgress] = useState();
    const animationFrameRef = useRef(null);

    const isCursorFocused = useRef(false);
    const isSongPageAnimating = useRef(false);

    const circleX = useRef();
    const circleY = useRef();

    const { contextSafe } = useGSAP();

    useGSAP(() => {
        if (!invertCircleWrapper.current) return;

        // Initialize quickTo
        circleX.current = gsap.quickTo(invertCircleWrapper.current, "x", {
            duration: 0.3,
            ease: "power2.out",
        });
        circleY.current = gsap.quickTo(invertCircleWrapper.current, "y", {
            duration: 0.3,
            ease: "power2.out",
        });
    }, []);

    const expandButton = contextSafe((button) => {
        gsap.to(button.current, { duration: 0.2, fontSize: "1.4rem" });
    });

    const shrinkButton = contextSafe((button) => {
        gsap.to(button.current, { duration: 0.1, fontSize: "1rem" });
    });

    // CURSOR

    const focusCursor = contextSafe((isSongTile = false) => {
        if (isCursorFocused.current) return;
        if (!pointCursor.current || !invertCircle.current) return;

        isCursorFocused.current = true;

        // Focus point
        if (isSongTile) {
            gsap.to(invertCircle.current, {
                duration: 0.2,
                scale: 0.45,
                overwrite: "auto",
                ease: "power2.out",
            });
        } else {
            gsap.to(invertCircle.current, {
                duration: 0.2,
                scale: 0.64,
                overwrite: "auto",
                ease: "power2.out",
            });
        }
        // Focus inverted circle

        // gsap.to(countdownCircleRef.current, {

        //     duration: 1,
        //     ease: "power1.inOut",
        // });
    });

    const unfocusCursor = contextSafe(() => {
        if (!isCursorFocused.current) return;
        if (!pointCursor.current || !invertCircle.current) return;

        isCursorFocused.current = false;

        // Focus point

        // Focus inverted circle
        gsap.to(invertCircle.current, {
            duration: 0.2,
            scale: 1,
            ease: "power2.out",
            overwrite: "auto",
        });
    });

    const moveCursor = contextSafe((event) => {
        if (!pointCursorWrapper.current || !invertCircleWrapper.current) return;
        if (!circleX.current || !circleY.current) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Set center cursor to mouse position
        gsap.set(pointCursorWrapper.current, { x: mouseX, y: mouseY });

        // Tween invert circle to mouse position using quickTo
        circleX.current(mouseX);
        circleY.current(mouseY);
    });

    useEffect(() => {
        document.addEventListener("mousemove", moveCursor);
        document.addEventListener("wheel", moveCursor);
        return () => {
            document.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("wheel", moveCursor);
        };
    }, []);

    // COUNTDOWN
    const startCountdown = (duration, onComplete) => {
        if (duration <= 0) return;

        const startTime = performance.now();

        const updateProgress = (now) => {
            const timeElapsed = now - startTime;
            let progress = Math.min(timeElapsed / duration, 1);
            setCountdownProgress(progress);

            if (progress < 1) {
                animationFrameRef.current =
                    requestAnimationFrame(updateProgress);
            } else {
                animationFrameRef.current = null;
                onComplete?.();
                return;
            }
        };

        animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    const cancelCountdown = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        setCountdownProgress(0);
    };

    return (
        <NavigationContext.Provider
            value={{
                logoRef,
                expandButton,
                shrinkButton,
                focusCursor,
                unfocusCursor,
                countdownProgress,
                startCountdown,
                cancelCountdown,
                isSongPageAnimating,
            }}
        >
            {children}
            <div ref={pointCursorWrapper} className="point-cursor-wrapper">
                <div ref={pointCursor} className="point-cursor"></div>
            </div>
            <div ref={invertCircleWrapper} className="invert-circle-wrapper">
                <div ref={invertCircle} className="invert-circle"></div>
                <CountdownCircle progress={countdownProgress}></CountdownCircle>
            </div>
        </NavigationContext.Provider>
    );
}
