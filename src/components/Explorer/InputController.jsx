import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";
import { useGesture, usePinch } from '@use-gesture/react'

const minZoom = 0.4;
const maxZoom = 2.5;
const zoomSpeed = 0.0005;
const panSpeed = 0.8;

function InputController({ canvasRef, children }) {
    const { size } = useThree();

    const [isDragging, setDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [nextCameraPosition, setNextCameraPosition] = useState({
        x: 0,
        y: 0,
        z: 10,
    });
    const [zoom, setZoom] = useState(1);

    const updateZoom = (e) => {
        let newZoom = zoom - e.deltaY * zoomSpeed;

        if (newZoom < minZoom) newZoom = minZoom;
        if (newZoom > maxZoom) newZoom = maxZoom;
        setZoom(newZoom);
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        const { clientX, clientY } = e;
        setLastMousePos({ x: clientX, y: clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseDrag = (e) => {
        const { clientX, clientY } = e;
        if (isDragging) {
            const deltaX = clientX - lastMousePos.x;
            const deltaY = clientY - lastMousePos.y;

            setNextCameraPosition({
                x: nextCameraPosition.x - deltaX * panSpeed,
                y:
                    nextCameraPosition.y +
                    deltaY * panSpeed * (size.width / size.height),
                z: nextCameraPosition.z,
            });
        }

        setLastMousePos({ x: clientX, y: clientY });
    };

    useFrame(({ camera }, delta) => {
        camera.position.lerp(
            new Vector3(
                nextCameraPosition.x,
                nextCameraPosition.y,
                nextCameraPosition.z
            ),
            0.06
        );

        camera.zoom = lerp(camera.zoom, zoom, 0.05);
        camera.updateProjectionMatrix();
    });


    return (
        <>
            {children}
            {/* Background */}
            <mesh
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onPointerMove={handleMouseDrag}
                onPointerLeave={handleMouseUp}
                onWheel={updateZoom}
                scale={[10000, 10000, 1]}
            >
                <planeGeometry args={[1, 1]} position={[0, 0, -1]} />
                <meshStandardMaterial color={"floralwhite"} />
            </mesh>
        </>
    );
}

export default InputController;
