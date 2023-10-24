function Element({ position, image, details }) {
    return (
        <>
            <mesh scale={[200, 200, 0]} position={[position.x, position.y, 1]}>
                <meshStandardMaterial color={"#303030"} />
                <planeGeometry args={[1, 1]} />
            </mesh>
        </>
    );
}

export default Element;