import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { NavigationProvider } from "./contexts/NavigationContext";
import { MusicProvider } from "./contexts/MusicContext";

const Root = () => {
    return (
        <NavigationProvider>
            <MusicProvider>
                <Header />
                <div className="body">
                    <Outlet />
                </div>
            </MusicProvider>
        </NavigationProvider>
    );
};

export default Root;
