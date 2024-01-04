import { createContext, useEffect, useState } from "react";
import { createBucketClient } from "@cosmicjs/sdk";
import { sortList } from "../utils";
import _, { filter } from 'lodash';

const initialValue = null;

const BUCKET_SLUG = import.meta.env.VITE_BUCKET_SLUG;
const READ_KEY = import.meta.env.VITE_READ_KEY;

const cosmic = createBucketClient({
    bucketSlug: BUCKET_SLUG,
    readKey: READ_KEY,
});
export const MusicContext = createContext(initialValue);

const filtersInit = { genre: [], language: [], year: [] };

export function MusicProvider({ children }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState([]);
    const [sortBy, setSortBy] = useState("title"); //title,artist,
    const [sortDirection, setSortDirection] = useState(1); // asc = 1 , desc = -1
    const [searchInput, setSearchInput] = useState("");
    const [selectedFilters, setSelectedFilters] = useState(filtersInit);
    const [appliedFilters, setAppliedFilters] = useState(filtersInit);

    useEffect(() => {
        setSongs(sortList([...songs], sortBy, sortDirection));
    }, [sortBy, sortDirection]);

    const getAllSongs = () => {
        cosmic.objects
            .find({
                type: "songs",
            })
            .props([
                "id",
                "title",
                "metadata.artist",
                "metadata.album",
                "metadata.cover_image",
                "metadata.thumbnail",
            ])
            .then((response) => {
                setSongs(response);
            });
    };

    const getArchiveSongs = () => {
        useEffect(() => {
            const query = {
                type: "songs",
                title: {
                    $regex: searchInput,
                    $options: "i",
                },
                // {
                //     "metadata.artist": {
                //         $elemMatch: {
                //             title: {
                //                 $regex: input,
                //                 $options: "i",
                //             },
                //         },
                //     },
                // },
            };

            if (appliedFilters.genre.length > 0)
                query["metadata.genre"] = {
                    $in: appliedFilters.genre,
                };

            if (appliedFilters.language.length > 0)
                query["metadata.language"] = {
                    $in: appliedFilters.language,
                };

            if (appliedFilters.year.length > 0)
                query["metadata.year"] = {
                    $in: appliedFilters.year,
                };

            cosmic.objects
                .find(query)
                .props([
                    "id",
                    "title",
                    "metadata.artist",
                    "metadata.album",
                    "metadata.cover_image",
                    "metadata.thumbnail",
                    "metadata.year",
                    "metadata.genre",
                    "metadata.duration",
                ])
                .then((response) => {
                    setSongs(sortList([...response.objects], sortBy, sortDirection));
                })
                .catch((e) => {
                    setSongs([]);
                });
        }, [searchInput, appliedFilters]);
    };


    const getSongByID = async (id) => {
        const response = await cosmic.objects
            .find({
                type: "songs",
                id: id,
            })
            .props([
                "id",
                "title",
                "metadata.artist",
                "metadata.album",
                "metadata.cover_image",
                "metadata.thumbnail",
                "metadata.year",
                "metadata.genre",
                "metadata.duration",
            ]);

        return response.objects[0];
    };

    const applyFilters = ()=>{
        setAppliedFilters(selectedFilters)
    }

    const didFiltersChange = ()=>{
        return !_.isEqual(appliedFilters,selectedFilters)
    }

    const areFiltersActive = ()=>{
        return !_.isEqual(appliedFilters,filtersInit)
    }

    const addFilter = (type, value) => {
        setSelectedFilters({
            ...selectedFilters,
            [type]: [...selectedFilters[type], value],
        });
    };

    const removeFilter = (type, value) => {
        setSelectedFilters({
            ...selectedFilters,
            [type]: selectedFilters[type].filter((filter) => {
                return filter != value;
            }),
        });
    };

    const clearFilter = (type) => {
        setSelectedFilters({
            ...selectedFilters,
            [type]: [],
        });
    };

    const clearAllFilters = () => {
        setFilters(filtersInit);
    };

    return (
        <MusicContext.Provider
            value={{
                songs,
                getSongByID,
                getArchiveSongs,
                sortBy,
                setSortBy,
                sortDirection,
                setSortDirection,
                setSearchInput,
                getAllSongs,
                addFilter,
                removeFilter,
                clearFilter,
                clearAllFilters,
                appliedFilters,
                applyFilters,
                selectedFilters,
                setSelectedFilters,
                didFiltersChange,
                areFiltersActive
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}
