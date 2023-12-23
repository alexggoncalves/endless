import "./archive.css";

import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";
import useFilters from "./useFilters";

import { getAllSongs, searchSongsByName } from "../../apiService.js";
import ListHeader from "./ListHeader.jsx";

const Archive = () => {
    const [list, setList] = useState();
    const [searchInput, setSearchInput] = useState();
    const [filtersApplied, setFiltersApplied] = useState(false);

    const [order, setOrder] = useState({ by: "artist", direction: true });  // direction: true -> asc  //  false -> desc
   

    const filters = useFilters((state) => state.filters);

    const toggleFilters = () => {
        setFiltersApplied(!filtersApplied);
    };

    const updateInput = (event) => {
        if (event.target.value != "") {
            setSearchInput(event.target.value);
        } else setSearchInput(null);
    };

    const getAll = () => {
        getAllSongs().then((songs) => {
            if (songs) setList(songs);
        });
    };

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        if (searchInput) {
            searchSongsByName(searchInput)
                .then((songs) => {
                    setList(songs);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            getAll();
        }
    }, [searchInput]);

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
                    <ListHeader />
                    {list?.map((song) => (
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
