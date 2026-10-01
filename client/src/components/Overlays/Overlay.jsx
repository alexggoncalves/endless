import "./overlay.css";

import { useContext, useEffect, useRef } from "react";

import { CursorContext } from "../../contexts/CursorContext";

const Overlay = ({ view, views, onClose }) => {
    const { invertColors } = useContext(CursorContext);
    const isOpen = view != null;

    // Keep showing the last view while the overlay fades out
    const lastView = useRef(view);
    if (view != null) lastView.current = view;
    const shownView = lastView.current;

    useEffect(() => {
        invertColors(isOpen);
    }, [isOpen]);

    const visibleClass = isOpen ? " is-visible" : "";

    return (
        <>
            <div className={"overlay-background" + visibleClass} />
            <div className={"overlay-backdrop" + visibleClass} />
            <div className={"overlay-container" + visibleClass}>
                {shownView && (
                    <div key={shownView} className="overlay-content">
                        {views[shownView]({ closeOverlay: onClose })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Overlay;