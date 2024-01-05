import { createContext, useEffect, useState } from "react";
import { createBucketClient } from "@cosmicjs/sdk";
import { sortByInt, sortList } from "../utils";
import _, { set } from "lodash";

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
    const [sortBy, setSortBy] = useState("title"); //title,artist,genre,album,release year,duration
    const [sortDirection, setSortDirection] = useState(1); // asc = 1 , desc = -1
    const [searchInput, setSearchInput] = useState("");
    const [selectedFilters, setSelectedFilters] = useState(filtersInit);
    const [appliedFilters, setAppliedFilters] = useState(filtersInit);
    const [releaseYears, setReleaseYears] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        setSongs(sortList([...songs], sortBy, sortDirection));
    }, [sortBy, sortDirection]);

    const getAllSongs = () => {
        setSongs([]);
        setLoading(true);
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
                setLoading(false);
            })
            .catch((e) => {
                setSongs([]);
                setLoading(false);
            });
    };

    const setExistingYears = (songs) => {
        let years = [];
        songs.map((song) => {
            if (!years.includes(song.metadata.year)) {
                years.push(song.metadata.year);
            }
        });
        setReleaseYears(years.sort((a, b) => sortByInt(a, b, -1)));
    };
    const setExistingGenres = (songs) => {
        let genres = [];
        songs.map((song) => {
            if (!genres.includes(song.metadata.genre)) {
                genres.push(song.metadata.genre);
            }
        });

        setGenres(genres);
    };

    const setExistingLanguages = (songs) => {
        let languages = [];
        songs.map((song) => {
            if (!languages.includes(song.metadata.language)) {
                languages.push(song.metadata.language);
            }
        });
        setLanguages(languages);
    };

    const getArchiveSongs = () => {
        useEffect(() => {
            setLoading(true);
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
                    "metadata.language",
                ])
                .then((response) => {
                    setLoading(false);
                    setSongs(
                        sortList([...response.objects], sortBy, sortDirection)
                    );
                    if (
                        releaseYears.length == 0 ||
                        genres.length == 0 ||
                        languages.length == 0
                    ) {
                        setExistingYears(response.objects);
                        setExistingGenres(response.objects);
                        setExistingLanguages(response.objects);
                    }
                })
                .catch((e) => {
                    setLoading(false);
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

    const applyFilters = () => {
        setAppliedFilters(selectedFilters);
    };

    const didFiltersChange = () => {
        return !_.isEqual(appliedFilters, selectedFilters);
    };

    const areFiltersActive = () => {
        return !_.isEqual(appliedFilters, filtersInit);
    };

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
        setSelectedFilters(filtersInit);
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
                areFiltersActive,
                loading,
                releaseYears,
                genres,
                languages,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
}
