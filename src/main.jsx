import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import About from "./components/About/About.jsx";
import Song from "./components/Song/Song.jsx";
import SuggestSong from "./components/SuggestSong/SuggestSong.jsx";
import Archive from "./components/Archive/Archive.jsx";

import "./general.css";
import Explorer from "./components/Explorer/Explorer.jsx";
import { MusicProvider } from "./contexts/MusicContext.jsx";

const router = createBrowserRouter([
    {
        path: "/endless",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/endless/",
                element: <Explorer />,
                children: [
                    {
                        path: "/endless/explorer/:songID",
                        element: <Song />,
                    },
                ],
            },
            {
                path: "/endless/about",
                element: <About />,
            },
            {
                path: "/endless/suggest",
                element: <SuggestSong />,
            },
            {
                path: "/endless/archive",
                element: <Archive />,
                children: [
                    {
                        path: "/endless/archive/:songID",
                        element: <Song />,
                    },
                ],
            },
            {
                path: "/endless/archive/search/:search",
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
