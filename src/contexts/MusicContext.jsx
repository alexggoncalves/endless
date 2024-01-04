import { createContext, useEffect, useState } from "react";
import { createBucketClient } from "@cosmicjs/sdk";

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
    // const [song, setSong] = useState();
    const [orderBy, setOrderBy] = useState("title"); //title,artist,
    const [orderDirection, setOrderDirection] = useState(true); // asc = true , desc = false
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState(filtersInit);

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
                setSongs(response.objects);
            });
    };

    const fetchSongs = () => {
        useEffect(() => {
            cosmic.objects
                .find({
                    type: "songs",
                    title: {
                        $regex: searchInput,
                        $options: "i",
                    },
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
                    setSongs(response.objects);
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
        setFilters(filtersInit)
    }

    return (
        <MusicContext.Provider
            value={{
                songs,
                getSongByID,
                fetchSongs,
                setOrderBy,
                setOrderDirection,
                setSearchInput,
                getAllSongs,
                addFilter,
                removeFilter,
                filters,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}
