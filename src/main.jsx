import "./general.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import About from "./components/About/About.jsx";
import Song from "./components/Song/Song.jsx";
import SuggestSong from "./components/SuggestSong/SuggestSong.jsx";
import Archive from "./components/Archive/Archive.jsx";
import Explorer from "./components/Explorer/Explorer.jsx";
import { MusicProvider } from "./contexts/MusicContext.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Explorer />,
                children: [
                    {
                        path: "/explorer/:songID",
                        element: <Song />,
                    },
                ],
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/suggest",
                element: <SuggestSong />,
            },
            {
                path: "/archive",
                element: <Archive />,
                children: [
                    {
                        path: "/archive/:songID",
                        element: <Song />,
                    },
                ],
            },
            {
                path: "/archive/search/:search",
                element: <Archive />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <MusicProvider>
            <RouterProvider router={router} />
        </MusicProvider>
    </React.StrictMode>
);
