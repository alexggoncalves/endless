import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useLayoutEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import { CursorContext } from "./CursorContext";

export const ExplorerControlsContext = createContext(null);

export function ExplorerControlsProvider({
    children,
    minZoom = 1,
    maxZoom = 2,
    zoomSmoothing = 8,
    panSmoothing = 6,
    panSpeed = 1.6,
}) {
    const { isMouseDown } = useContext(CursorContext);
    const camera = useThree((s) => s.camera);
    const events = useThree((s) => s.events);

    const target = useRef({ x: 0, y: 0 });
    const targetZoom = useRef(MathUtils.clamp(camera.zoom, minZoom, maxZoom));
    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });
    const plane = useRef();
    const isPointerOverCanvas = useRef(false);
    const lastCameraState = useRef({ x: 0, y: 0, zoom: 0 });

    // Track whether the pointer is over the canvas (and not over HTML UI on top of it)
    useEffect(() => {
        const element = events.connected;
        if (!element) return;

        const onEnter = () => (isPointerOverCanvas.current = true);
        const onLeave = () => (isPointerOverCanvas.current = false);

        element.addEventListener("pointermove", onEnter);
        element.addEventListener("pointerleave", onLeave);
        return () => {
            element.removeEventListener("pointermove", onEnter);
            element.removeEventListener("pointerleave", onLeave);
        };
    }, [events.connected]);

    useFrame((_, delta) => {
        camera.position.x = MathUtils.damp(
            camera.position.x,
            target.current.x,
            panSmoothing,
            delta,
        );
        camera.position.y = MathUtils.damp(
            camera.position.y,
            target.current.y,
            panSmoothing,
            delta,
        );
        camera.zoom = MathUtils.damp(
            camera.zoom,
            targetZoom.current,
            zoomSmoothing,
            delta,
        );
        camera.updateProjectionMatrix();

        plane.current?.position.set(camera.position.x, camera.position.y, -1);

        const prev = lastCameraState.current;
        const cameraMoved =
            Math.abs(camera.position.x - prev.x) > 0.01 ||
            Math.abs(camera.position.y - prev.y) > 0.01 ||
            Math.abs(camera.zoom - prev.zoom) > 0.0001;

        if (cameraMoved && isPointerOverCanvas.current) events.update?.();

        prev.x = camera.position.x;
        prev.y = camera.position.y;
        prev.zoom = camera.zoom;
    });

    useLayoutEffect(() => {
        camera.zoom = targetZoom.current;
        camera.position.x = target.current.x;
        camera.position.y = target.current.y;
        camera.updateProjectionMatrix();
    }, [camera]);

    const onPointerDown = (e) => {
        e.target.setPointerCapture?.(e.pointerId);
        dragging.current = true;
        isMouseDown.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    };

    const endDrag = () => {
        dragging.current = false;
        isMouseDown.current = false;
    };

    const onPointerMove = (e) => {
        if (!dragging.current) return;
        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };

        target.current.x -= (dx * panSpeed) / camera.zoom;
        target.current.y += (dy * panSpeed) / camera.zoom;
    };

    const onWheel = (e) => {
        targetZoom.current = MathUtils.clamp(
            targetZoom.current - e.deltaY * 0.001,
            minZoom,
            maxZoom,
        );
    };

    return (
        <ExplorerControlsContext.Provider
            value={{ cameraPosition: camera.position, target }}
        >
            {children}
            <mesh
                ref={plane}
                onPointerDown={onPointerDown}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerMove={onPointerMove}
                onWheel={onWheel}
            >
                <planeGeometry args={[100000, 100000]} />
                <meshBasicMaterial color="#e3e3e3" />
            </mesh>
        </ExplorerControlsContext.Provider>
    );
}
