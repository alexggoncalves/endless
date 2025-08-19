import { createContext, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { useGesture, usePinch } from "@use-gesture/react";
import { useContext } from "react";

import { NavigationContext } from "./NavigationContext";

const initialValue = null;

export const ExplorerControlsContext = createContext(initialValue);

export function ExplorerControlsProvider({
    children,
    minZoom = 0.8,
    maxZoom = 2,
    zoomSmoothness = 80,
    cameraSmoothness = 60,
    panSpeed = 1.6,
}) {
    const [zoom, setZoom] = useState(1);
    const [cameraPosition, setCameraPosition] = useState({
        x: 0,
        y: 0,
        z: 1000,
    });

    const [isDragging, setDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [nextCameraPosition, setNextCameraPosition] = useState({
        x: 0,
        y: 0,
        z: 1000,
    });

    const {isMouseDown} = useContext(NavigationContext)

    useFrame(({ camera }) => {
        camera.position.lerp(
            new Vector3(
                nextCameraPosition.x,
                nextCameraPosition.y,
                nextCameraPosition.z
            ),
            1/(cameraSmoothness)
        );

        camera.zoom = lerp(camera.zoom, zoom, 1/(zoomSmoothness));
        camera.updateProjectionMatrix();

        setCameraPosition(camera.position);
    });

    const handleMouseDown = (e) => {
        setDragging(true);
        const { clientX, clientY } = e;
        setLastMousePos({ x: clientX, y: clientY });
        isMouseDown.current = true;
    };

    const handleMouseUp = () => {
        setDragging(false);
        isMouseDown.current = false;
    };

    const handleMouseDrag = (e) => {
        const { clientX, clientY } = e;
        if (isDragging) {
            const deltaX = clientX - lastMousePos.x;
            const deltaY = clientY - lastMousePos.y;

            setNextCameraPosition({
                x: nextCameraPosition.x - deltaX * panSpeed,
                y: nextCameraPosition.y + deltaY * panSpeed,
                z: nextCameraPosition.z,
            });
        }

        setLastMousePos({ x: clientX, y: clientY });
    };

    // Set zoom based on scroll wheel
    const updateZoom = (e) => {
        let newZoom = zoom - e.deltaY * (1/(zoomSmoothness*10));

        if (newZoom < minZoom) newZoom = minZoom;
        if (newZoom > maxZoom) newZoom = maxZoom;
        setZoom(newZoom);
    };

    return (
        <ExplorerControlsContext.Provider
            value={{
                cameraPosition
            }}
        >
            {children}
            <mesh
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onPointerMove={handleMouseDrag}
                onPointerLeave={handleMouseUp}
                onWheel={updateZoom}
                position={[cameraPosition.x, cameraPosition.y, -1]}
            >
                <planeGeometry args={[4000, 3000]} />
                <meshBasicMaterial color={"#e3e3e3ff"} />
            </mesh>
        </ExplorerControlsContext.Provider>
    );
}
