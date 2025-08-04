import { createContext, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";

const initialValue = null;

export const NavigationContext = createContext(initialValue);

export function NavigationProvider({ children }) {
    const isCursorFocused = useRef(false);
    const isSongPageAnimating = useRef(false);

    const { contextSafe } = useGSAP();

    const getCursor = () => document.querySelector(".cursor");

    const expandButton = contextSafe((backButton) => {
        gsap.to(backButton.current, { duration: 0.2, fontSize: "1.4rem" });
    });

    const shrinkButton = contextSafe((backButton) => {
        gsap.to(backButton.current, { duration: 0.1, fontSize: "1rem" });
    });

    const focusCursor = contextSafe(() => {
        const cursor = getCursor();
        if (!cursor && !isCursorFocused.current) return;
        isCursorFocused.current = true;

        gsap.killTweensOf(cursor);
        gsap.to(cursor, {
            duration: 0.15,
            scale: 0.65,
        });
    });

    const unfocusCursor = contextSafe(() => {
        const cursor = getCursor();
        if (!cursor && isCursorFocused.current) return;
        isCursorFocused.current = false;

        gsap.killTweensOf(cursor);
        gsap.to(cursor, {
            duration: 0.2,
            scale: 1,
            ease: "power2.out",
        });
    });

    return (
        <NavigationContext.Provider
            value={{
                expandButton,
                shrinkButton,
                focusCursor,
                unfocusCursor,
                isSongPageAnimating
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}
