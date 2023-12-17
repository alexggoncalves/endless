import Filters from "./Filters";
import ListElement from "./ListElement";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import "./archive.css";
import { v4 as uuidv4 } from "uuid";

import { getAllSongs, searchSongsByName } from "../apiService.js";

const Archive = () => {
    const [list, setList] = useState();
    const [searchInput, setSearchInput] = useState();

    const updateInput = (event) => {
        setSearchInput(event.target.value);
    };

    useEffect(() => {
        getAllSongs()
            .then((songs) => {
                if (songs) setList(songs);
            })
            .catch((error) => console.log(error));
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
        }
    }, [searchInput]);

    if (list) {
        return (
            <>
                {/* Search bar */}
                <input id="search-bar" onChange={updateInput} type="text" />
                <Filters></Filters>

                {/* List */}
                <hr></hr>
                {list.map((song) => (
                    <ListElement key={uuidv4()} song={song} />
                ))}
            </>
        );
    }
};

export default Archive;
