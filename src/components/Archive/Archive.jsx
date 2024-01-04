import "./archive.css";

import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";


import ListHeader from "./ListHeader.jsx";
import { MusicContext } from "../../contexts/MusicContext.jsx";

const Archive = () => {
    const [filtersApplied, setFiltersApplied] = useState(false);

    const { fetchSongs, songs, setSearchInput, setOrderDirection, setOrderBy } =
        useContext(MusicContext);
    fetchSongs();

    const toggleFilters = () => {
        setFiltersApplied(!filtersApplied);
    };

    const updateInput = (event) => {
        if (event.target.value != "") {
            setSearchInput(event.target.value);
        } else setSearchInput("");
    };

    const sortList = (by, direction) => {
        setOrderBy(by);
        setOrderDirection(direction);
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
            <Filters toggleFilters={toggleFilters} applied={filtersApplied} />

            {/* Songs table */}
            <table>
                <tbody>
                    <ListHeader sortList={sortList} />
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
