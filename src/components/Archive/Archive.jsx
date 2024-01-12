import "./archive.css";

import Filters from "./Filters.jsx";
import ListElement from "./ListElement.jsx";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Outlet } from "react-router-dom";

import ListHeader from "./ListHeader.jsx";
import { MusicContext } from "../../contexts/MusicContext.jsx";
import Loading from "../Loading.jsx";
import NotFound from "../No Results.jsx";

import loadingGif from "./../../assets/icons8-loading.gif"

const Archive = () => {
    const {
        getArchiveSongs,
        songs,
        setSearchInput,
        loading,
        songOpened
    } = useContext(MusicContext);

    getArchiveSongs();

    const updateInput = (event) => {
        if (event.target.value != "") {
            setSearchInput(event.target.value);
        } else setSearchInput("");
    };

    return (
        <div className={`${songOpened ? `no-scroll`:undefined}`} >
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
            {loading ? <Loading loadingGif={loadingGif}/> : undefined}
            {songs.length == 0 && !loading ? <NotFound/> : undefined}

            {/* Song details page (opens when url changes to .../archive/:songID) */}
            <Outlet /> 
        </div>
    );
};

export default Archive;
