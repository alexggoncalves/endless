import { useState, useRef, useEffect } from "react";
import Wave from "./Wave";
import { lerp } from "three/src/math/MathUtils";

const DividerWaves = ({ mobileOnly = false }) => {
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const scrollSpeedRef = useRef(0);
    const lastScrollY = useRef(window.scrollY);
    const animationRef = useRef();
    const waves = useRef(null);

    const maxSpeed = 0.6;
    const minSpeed = 0.1;

    const getRandomBaseSpeed = () => {
        return Math.random() * (maxSpeed - minSpeed) + minSpeed;
    };

    // Smooth deceleration loop
    useEffect(() => {
        const update = () => {
            if (scrollSpeedRef.current >= 0.01) {
                scrollSpeedRef.current = lerp(scrollSpeedRef.current, 0, 0.01);
            } else {
                scrollSpeedRef.current = 0;
            }
            setScrollSpeed(scrollSpeedRef.current);
            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    // Scroll speed acceleration on scroll
    useEffect(() => {
        let container = null;
        if (waves.current && container === null) {
            container = waves.current.closest("div").parentElement; 
        }

        const handleScroll = () => {
            const currentScrollY = container.scrollTop;
            const delta = Math.abs(currentScrollY - lastScrollY.current);

            if (delta > 0) {
                scrollSpeedRef.current = Math.min(
                    maxSpeed,
                    scrollSpeedRef.current + delta / 200
                );
                lastScrollY.current = currentScrollY;
            }
        };
        if (container) container.addEventListener("scroll", handleScroll);

        return () => {
            if (container)
                container.removeEventListener("scroll", handleScroll);
        };
    }, [waves.current]);

    if (mobileOnly) return null;

    return (
        <div
            ref={waves}
            className={`divider-waves ${mobileOnly ? "mobile-only" : ""}`}
        >
            <Wave
                weight={1}
                direction={1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={1}
                direction={-1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={2}
                direction={1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={3}
                direction={-1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={2}
                direction={1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={1}
                direction={-1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
            <Wave
                weight={1}
                direction={1}
                baseSpeed={getRandomBaseSpeed()}
                scrollSpeed={scrollSpeed}
            />
        </div>
    );
};

export default DividerWaves;
