import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useState, useEffect, Suspense } from "react";
import "./archive.css";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";

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
            <input id="search-bar" onChange={updateInput} type="text" placeholder="Search..."/>
            <Filters></Filters>

            {/* List */}
            <Suspense fallback={<span>Loading...</span>}>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th><span>TITLE/ARTIST</span></th>
                            <th><span>ALBUM</span></th>
                            <th><span>GENRE</span></th>
                            <th><span>YEAR</span></th>
                            <th><span>DURATION</span></th>
                        </tr>
                        {list?.map((song) => (
                            <ListElement key={uuidv4()} song={song} />
                        ))}
                        
                    </tbody>
                </table>
            </Suspense>
            <Outlet/>
        </>
    );
};

export default Archive;
