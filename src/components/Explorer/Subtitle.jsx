import { Text } from "@react-three/drei";

import titleFont from "../../assets/fonts/Mulish-ExtraBold.ttf";
import artistFont from "../../assets/fonts/Mulish-Light.ttf";
import { useEffect, useRef } from "react";

function Subtitle({ position, title, artist }) {
    const textRef = useRef();

    useEffect(() => {
        console.log(textRef.current.text = `by ${artist}`);
    }, []);

    return (
        <group position={position}>
            <Text
                color="black"
                anchorX="left"
                anchorY="top"
                fontSize={"12"}
                font={titleFont}
            >
                {title}
            </Text>
            <Text
                ref={textRef}
                color="black"
                anchorX="left"
                anchorY="top"
                fontSize={"12"}
                position={[0, -12, 0]}
                font={artistFont}
            >
                by {artist}
            </Text>
        </group>
    );
}

export default Subtitle;
