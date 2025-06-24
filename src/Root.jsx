import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useRef, useEffect } from "react";

const Root = () => {
    const cursor = useRef();

    const moveCursor = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY + window.scrollY;
        if (cursor.current) {
            cursor.current.style.left = mouseX + "px";
            cursor.current.style.top = mouseY + "px";
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", moveCursor);
        document.addEventListener("wheel", moveCursor);
        return () => {
            document.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("wheel", moveCursor);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="body black-text">
                <Outlet />
            </div>
            <div ref={cursor} className="cursor"></div>
        </>
    );
};

export default Root;
