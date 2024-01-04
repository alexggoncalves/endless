import "./archive.css";

import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";

import ListHeader from "./ListHeader.jsx";
import { MusicContext } from "../../contexts/MusicContext.jsx";

const Archive = () => {
    const {
        getArchiveSongs,
        songs,
        setSearchInput,
    } = useContext(MusicContext);

    getArchiveSongs();

    const updateInput = (event) => {
        if (event.target.value != "") {
            setSearchInput(event.target.value);
        } else setSearchInput("");
    };

    return (
        <>
            {/* Search bar */}
            <input
                id="search-bar"
                onChange={updateInput}
                type="text"
                placeholder="Search..."
            />
            <Filters/>

            {/* Songs table */}
            <table>
                <tbody>
                    <ListHeader/>
                    {songs?.map((song) => (
                        <ListElement key={uuidv4()} song={song} />
                    ))}
                </tbody>
            </table>

            {/* Song details page (opens when url changes to .../archive/:songID) */}
            <Outlet />
        </>
    );
};

export default Archive;
