import "./archive.css";

import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";
import useFilters from "./useFilters";

import { getAllSongs, searchSongsByName } from "../../apiService.js";

const Archive = () => {
    const [list, setList] = useState();
    const [searchInput, setSearchInput] = useState();
    const [orderBy, setOrderBy] = useState("title");
    const [orderDirection, setOrderDirection] = useState("asc");
    const genreFilters = useFilters((state) => state.genreFilters);


    const updateInput = (event) => {
        if (event.target.value != "") {
            setSearchInput(event.target.value);
        } else setSearchInput(null);
    };

    const getAll = () => {
        getAllSongs()
            .then((songs) => {
                if (songs) setList(songs);
            })
            .catch((error) => console.log(error));
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
            <Filters></Filters>

            {/* List */}
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            <span>TITLE/ARTIST</span>
                        </th>
                        <th>
                            <span>ALBUM</span>
                        </th>
                        <th>
                            <span>GENRE</span>
                        </th>
                        <th>
                            <span>YEAR</span>
                        </th>
                        <th>
                            <span>DURATION</span>
                        </th>
                    </tr>
                    {list?.map((song) => (
                        <ListElement key={uuidv4()} song={song} />
                    ))}
                </tbody>
            </table>
            <Outlet />
        </>
    );
};

export default Archive;
