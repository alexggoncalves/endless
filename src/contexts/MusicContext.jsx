import { createContext, useEffect, useState } from "react";
import { createBucketClient } from "@cosmicjs/sdk";
import { sortList } from "../utils";

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
    const [filters, setFilters] = useState(filtersInit);

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
            cosmic.objects
                .find({
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
                ])
                .then((response) => {
                    setSongs(sortList([...response.objects], "title", 1));
                })
                .catch((e) => {
                    console.log(e);
                });
        }, [searchInput]);
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

    const addFilter = (type, value) => {
        setFilters({
            ...filters,
            [type]: [...filters[type], value],
        });
        console.log(filters);
    };

    const removeFilter = (type, value) => {
        setFilters({
            ...filters,
            [type]: filters[type].filter((filter) => {
                return filter != value;
            }),
        });
    };

    const clearFilter = (type) => {
        setFilters({
            ...filters,
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
                filters,
                clearFilter,
                clearAllFilters,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}
