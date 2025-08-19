import "./general.css";
import "./header.css";
import  "./components/UI/ui.css"
import  "./components/PlaylistMenu/playlistMenu.css"

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx"

import ErrorPage from "./components/ErrorPage.jsx";
import Song from "./components/Song/Song.jsx";
import Explorer from "./components/Explorer/Explorer.jsx";

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
        <RouterProvider router={router} />
    </React.StrictMode>
);
