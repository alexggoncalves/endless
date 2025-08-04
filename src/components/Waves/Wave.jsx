import { useRef, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

const Wave = ({ weight, direction, baseSpeed, scrollSpeed, scrollSpeedMultiplier = 3 }) => {
    const wave = useRef();
    let x = 0;

    const scrollSpeedRef = useRef(scrollSpeed);
    scrollSpeedRef.current = scrollSpeed;

    useGSAP(() => {
        const waveWidth = wave.current.clientWidth;
        const xOffset = Math.random() * 50;

        x = direction === 1 ? waveWidth / 2 - xOffset : -waveWidth / 2 + xOffset;
        
        const ticker = gsap.ticker.add(() => {
            x += (baseSpeed + (scrollSpeedRef.current * scrollSpeedMultiplier)) * direction;
            
            if (direction == -1 && x <= -waveWidth / 2) {
                x = 0;
            } else if (direction == 1 && x >= 0) {
                x = -waveWidth / 2;
            }

            wave.current.style.transform = `translateX(${x}px)`;
        });

        return () => {
            gsap.ticker.remove(ticker);
        };
    });

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 3119 70.53"
            ref={wave}
        >
            <path
                fill="none"
                stroke="#202020"
                strokeWidth={weight || 1}
                d="M3119 57.84c-53.75-.19-75.25-43.59-129-43.77-54.3-.19-76.2 44-130.5 43.77-53.75-.19-75.25-43.59-129-43.77-54.3-.19-76.2 44-130.5 43.77-53.75-.19-75.25-43.59-129-43.77-54.3-.19-78.7 42.59-133 42.4-53.75-.19-75.25-43.59-129-43.77-54.3-.19-76.2 44-130.5 43.77-53.75-.19-75.25-43.59-129-43.77-54.3-.19-76.2 44-130.5 43.77-53.75-.19-75.25-43.59-129-43.77-54.3-.19-76.2 44-130.5 43.77-54.3.23-76.2-43.96-130.5-43.77-53.75.18-75.25 43.58-129 43.77-54.3.23-76.2-43.96-130.5-43.77-53.75.18-75.25 43.58-129 43.77-54.3.23-76.2-43.96-130.5-43.77-53.73.18-75.24 43.58-129 43.77-54.3.19-78.7-42.59-133-42.4-53.73.18-75.24 43.63-129 43.77-54.3.23-76.2-43.96-130.5-43.77-53.75.18-75.23 43.63-129 43.77-54.3.23-76.2-43.96-130.5-43.77-53.73.18-75.24 43.63-129 43.77"
            ></path>
        </svg>
    );
};

export default Wave;
