import { useContext } from "react";

import triangle from "../../assets/triangle.png";
import { MusicContext } from "../../contexts/MusicContext";

const ListHeader = () => {
    const { sortBy, setSortBy, sortDirection, setSortDirection } =
        useContext(MusicContext);

    const setSort = (value) => {
        if (value == "title/artist") {
            if (sortBy != "title" && sortBy != "artist") {
                setSortBy("title");
                setSortDirection(1);
            } else if (sortDirection == -1) {
                if (sortBy == "title") {
                    setSortBy("artist");
                } else {
                    setSortBy("title");
                }
                setSortDirection(1);
            } else {
                setSortDirection(-1);
            }
        } else if (value == sortBy) {
            setSortBy(value);
            if(sortDirection == 1) setSortDirection(-1)
            else setSortDirection(1);
        } else {
            setSortBy(value);
            setSortDirection(1);
        }
    };

    const DirectionTriangle = () => {
        return (
            <img
                src={triangle}
                alt="triangle"
                className={`sortTriangle ${sortDirection == 1 ? "invert" : ""}`}
            />
        );
    };

    return (
        <tr>
            <th></th>
            <th>
                <span onClick={() => setSort("title/artist")}>
                    <span className={sortBy == "title" ? "bold" : undefined}>
                        TITLE
                    </span>
                    {" / "}
                    <span className={sortBy == "artist" ? "bold" : undefined}>
                        ARTIST
                    </span>
                    {sortBy == "title" || sortBy == "artist" ? (
                        <DirectionTriangle />
                    ) : undefined}
                </span>
            </th>
            <th className="hide-in-mobile">
                <span
                    className={sortBy == "album" ? "bold" : undefined}
                    onClick={() => setSort("album")}
                >
                    ALBUM
                    {sortBy == "album" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th>
                <span
                    className={sortBy == "genre" ? "bold" : undefined}
                    onClick={() => setSort("genre")}
                >
                    GENRE
                    {sortBy == "genre" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th>
                <span
                    className={sortBy == "year" ? "bold" : undefined}
                    onClick={() => setSort("year")}
                >
                    YEAR
                    {sortBy == "year" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th  className="hide-in-mobile">
                <span
                    className={sortBy == "duration" ? "bold" : undefined}
                    onClick={() => setSort("duration")}
                >
                    DURATION
                    {sortBy == "duration" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
        </tr>
    );
};

export default ListHeader;
