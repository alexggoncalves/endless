const cx = 70, cy = 70, r = 25;
export const CIRCUMFERENCE = 2 * Math.PI * r;

const startAngle = (135 * Math.PI) / 180;
const dx = r * Math.cos(startAngle);
const dy = -r * Math.sin(startAngle);

const CountdownCircle = ({ pathRef }) => (
    <svg className="count-down-circle" width="140" height="140" viewBox="0 0 140 140">
        <path
            ref={pathRef}
            fill="none"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE}
            opacity="0"
            d={`M ${cx} ${cy} m ${dx} ${dy}
                a ${r} ${r} 0 1 1 ${-dx * 2} ${-dy * 2}
                a ${r} ${r} 0 1 1 ${dx * 2} ${dy * 2}`}
        />
    </svg>
);

export default CountdownCircle;