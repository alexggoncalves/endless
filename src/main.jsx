import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import About from "./components/About/About.jsx";
import Song from "./components/Song/Song.jsx";
import SuggestSong from "./components/SuggestSong/SuggestSong.jsx"
import Archive from "./components/Archive/Archive.jsx";

import "./general.css";
import Explorer from "./components/Explorer/Explorer.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <Explorer />,
          },
          {
            path: "song/:songID",
            element: <Song />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "suggest",
            element: <SuggestSong />,
          },
          {
            path: "archive",
            element: <Archive />,
          },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
