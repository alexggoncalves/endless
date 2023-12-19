import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import SearchBar from "./SearchBar.jsx";
import { useState, useEffect, Suspense } from "react";
import "./archive.css";
import { v4 as uuidv4 } from "uuid";

import { getAllSongs, searchSongsByName } from "../apiService.js";

const Archive = () => {
    const [list, setList] = useState();
    const [searchInput, setSearchInput] = useState();

    const updateInput = (event) => {
        setSearchInput(event.target.value);
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
            <input id="search-bar" onChange={updateInput} type="text" />
            <Filters></Filters>

            {/* List */}
            <Suspense fallback={<span>Loading...</span>}>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title/Artist</th>
                            <th>Album</th>
                            <th>Genre</th>
                            <th>Year</th>
                            <th>Duration</th>
                        </tr>
                        {/* <hr></hr> */}
                        {list?.map((song) => (
                            <ListElement key={uuidv4()} song={song} />
                        ))}
                    </tbody>
                </table>
            </Suspense>
        </>
    );
};

export default Archive;
