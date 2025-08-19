import { Text } from "@react-three/drei";

import titleFont from "../../assets/fonts/Mulish-ExtraBold.ttf";
import artistFont from "../../assets/fonts/Mulish-Light.ttf";
import { useRef, useState } from "react";

function Subtitle({ position, title, artist, tileSize }) {
    const [titleHeight, setTitleHeight] = useState(0);

    return (
        <group position={position} scale={1 / tileSize}>
            <Text
                color="#303030"
                anchorX="left"
                anchorY="top"
                fontSize={16}
                font={titleFont}
                maxWidth={tileSize}
                onSync={(text) => {
                    const height =
                        text.geometry.boundingBox.max.y -
                        text.geometry.boundingBox.min.y;
                    setTitleHeight(height);
                }}
            >
                {title}
            </Text>
            <Text
                color="#303030"
                anchorX="left"
                anchorY="top"
                fontSize={12}
                position={[0, -titleHeight, 0]}
                font={artistFont}
                maxWidth={tileSize}
            >
                {artist}
            </Text>
        </group>
    );
}

export default Subtitle;
