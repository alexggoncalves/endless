import "./general.css";
import "./header.css"

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Song from "./components/Song/Song.jsx";
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
