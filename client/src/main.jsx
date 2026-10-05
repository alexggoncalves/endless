import "./general.css";
import "./components/UI/ui.css";
import "./components/PlaylistMenu/playlistMenu.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";

import ErrorPage from "./components/ErrorPage.jsx";
import Song from "./components/Song/Song.jsx";
import App from "./App.jsx";

import { CursorProvider } from "./contexts/CursorContext";
import { MusicProvider } from "./contexts/MusicContext";
import { PreviewProvider } from "./contexts/PreviewContext";
import { ExplorerProvider } from "./contexts/ExplorerContext.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    {
                        path: "/explorer/:songID",
                        element: <Song />,
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <CursorProvider>
            <MusicProvider>
                <PreviewProvider>
                    <ExplorerProvider>
                        <RouterProvider router={router} />
                    </ExplorerProvider>
                </PreviewProvider>
            </MusicProvider>
        </CursorProvider>
    </React.StrictMode>,
);
