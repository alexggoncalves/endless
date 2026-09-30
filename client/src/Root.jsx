import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { CursorProvider } from "./contexts/CursorContext";
import { MusicProvider } from "./contexts/MusicContext";

const Root = () => {
    return (
        <CursorProvider>
            <MusicProvider>
                <Header />
                <div className="body">
                    <Outlet />
                </div>
            </MusicProvider>
        </CursorProvider>
    );
};

export default Root;
