import { useState } from "react";
import useOrder from "./useOrder";

import triangle from "../../assets/triangle.png";

const ListHeader = ({ sortList }) => {
    const [orderBy, setOrderBy] = useState("title");
    const [orderDirection, setOrderDirection] = useState(true);

    const setOrder = (value) => {
        if (value == "title/artist") {
            if (orderBy != "title" && orderBy != "artist") {
                sortList("title", true);
                setOrderBy("title");
                setOrderDirection(true);
            } else if (orderDirection == false) {
                if (orderBy == "title") {
                    sortList("artist", true);
                    setOrderBy("artist");
                } else {
                    sortList("title", true);
                    setOrderBy("title");
                }
                setOrderDirection(true);
            } else {
                setOrderDirection(false);
                sortList(orderBy, false);
            }
        } else if (value == orderBy) {
            sortList(value, !orderDirection);
            setOrderBy(value);
            setOrderDirection(!orderDirection);
            return;
        } else {
            sortList(value, true);
            setOrderBy(value);
            setOrderDirection(true);
            return;
        }
    };

    const DirectionTriangle = () => {
        return (
            <img
                src={triangle}
                alt="triangle"
                className={`orderTriangle ${orderDirection ? "invert" : ""}`}
            />
        );
    };

    return (
        <tr>
            <th></th>
            <th>
                <span onClick={() => setOrder("title/artist")}>
                    <span className={orderBy == "title" ? "bold" : undefined}>
                        TITLE
                    </span>
                    {" / "}
                    <span className={orderBy == "artist" ? "bold" : undefined}>
                        ARTIST
                    </span>
                    {orderBy == "title" || orderBy == "artist" ? (
                        <DirectionTriangle />
                    ) : undefined}
                </span>
            </th>
            <th>
                <span
                    className={orderBy == "album" ? "bold" : undefined}
                    onClick={() => setOrder("album")}
                >
                    ALBUM
                    {orderBy == "album" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th>
                <span
                    className={orderBy == "genre" ? "bold" : undefined}
                    onClick={() => setOrder("genre")}
                >
                    GENRE
                    {orderBy == "genre" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th>
                <span
                    className={orderBy == "year" ? "bold" : undefined}
                    onClick={() => setOrder("year")}
                >
                    YEAR
                    {orderBy == "year" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
            <th>
                <span
                    className={orderBy == "duration" ? "bold" : undefined}
                    onClick={() => setOrder("duration")}
                >
                    DURATION
                    {orderBy == "duration" ? <DirectionTriangle /> : undefined}
                </span>
            </th>
        </tr>
    );
};

export default ListHeader;
