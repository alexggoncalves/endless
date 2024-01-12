import { Text } from "@react-three/drei";

import titleFont from "../../assets/fonts/Mulish-ExtraBold.ttf";
import artistFont from "../../assets/fonts/Mulish-Light.ttf";

function Subtitle({ position, title, artist }) {
    return (
        <group position={position}>
            <Text
                color="#303030"
                anchorX="left"
                anchorY="top"
                fontSize={"12"}
                font={titleFont}
            >
                {title}
            </Text>
            <Text
                color="#303030"
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
