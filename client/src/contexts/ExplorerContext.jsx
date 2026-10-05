import { createContext, useRef, useState } from "react";

export const ExplorerContext = createContext(null);

export function ExplorerProvider({ children }) {
    const isSongPageOpening = useRef(false);
    const isSongPageClosing = useRef(false);
    const [colorsInverted, setColorsInverted] = useState(true);

    const invertColors = (invert) => {
        setColorsInverted(invert);
    };

    return (
        <ExplorerContext.Provider
            value={{
                invertColors,
                colorsInverted,
                isSongPageOpening,
                isSongPageClosing,
            }}
        >
            {children}
        </ExplorerContext.Provider>
    );
}
