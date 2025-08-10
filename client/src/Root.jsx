import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { NavigationProvider } from "./contexts/NavigationContext";
import { SpotifyProvider } from "./contexts/SpotifyContext";

const Root = () => {
    return (
        <NavigationProvider>
            <SpotifyProvider>
                <Header />
                <div className="body black-text">
                    <Outlet />
                </div>
            </SpotifyProvider>
        </NavigationProvider>
    );
};

export default Root;
