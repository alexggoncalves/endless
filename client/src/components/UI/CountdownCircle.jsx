import { useEffect,useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
gsap.registerPlugin(DrawSVGPlugin);

const CountdownCircle = ({ progress }) => {
    const countdownCircleRef = useRef();

    const { contextSafe } = useGSAP();

    const cx = 70;
    const cy = 70;
    const r = 25;

    const startAngle = (135 * Math.PI) / 180;
    const dx = r * Math.cos(startAngle);
    const dy = -r * Math.sin(startAngle);

    const updateProgressCircle = contextSafe(() => {
        gsap.to(countdownCircleRef.current, {
            duration: 0.2,
            drawSVG: `0 ${progress * 100}%`,
            ease: "linear",
            overwrite: "auto",
        });
    });

    useEffect(()=>{
        updateProgressCircle();

    },[progress])

    return (
        <svg
            className="count-down-circle"
            width="140"
            height="140"
            viewBox="0 0 140 140"
            scale={0.65}
        >
            <path
                ref={countdownCircleRef}
                fill="none"
                stroke="white"
                strokeWidth="12px"
                strokeLinecap="round"
                d={`M ${cx}, ${cy}
                m ${dx}, ${dy}
                a ${r},${r} 0 1,1 ${-(dx * 2)},${-(dy * 2)}
                a ${r},${r} 0 1,1 ${dx * 2},${dy * 2}`}
            />
        </svg>
    );
};

export default CountdownCircle;
