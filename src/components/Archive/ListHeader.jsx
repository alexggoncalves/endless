import { useState } from "react";
import useOrder from "./useOrder";

const ListHeader = () => {
    const set = useOrder((state) => state.setOrder);
    const currentOrder = useOrder((state) => state.order);

    const setOrder = (value) => {
        let orderBy = currentOrder.by;
        let direction = currentOrder.direction; // direction: true -> asc  //  false -> desc

        if (value == "title/artist") {
            if (orderBy != "title" && orderBy != "artist") {
                orderBy = "title";
                direction = true;
            } else if (direction == false) {
                if (orderBy == "title") orderBy = "artist";
                else orderBy = "title";
                direction = true;
            } else {
                direction = false;
            }
        } else if (value == orderBy) direction = !direction;
        else {
            orderBy = value;
            direction = true;
        }
        console.log(`by:${orderBy}\ndirection:${direction}`);
        set(orderBy, direction);
    };

    return (
        <tr>
            <th></th>
            <th>
                <span onClick={() => setOrder("title/artist")}>
                    <span>TITLE</span>/<span>ARTIST</span>
                </span>
            </th>
            <th>
                <span onClick={() => setOrder("album")}>ALBUM</span>
            </th>
            <th>
                <span onClick={() => setOrder("genre")}>GENRE</span>
            </th>
            <th>
                <span onClick={() => setOrder("year")}>YEAR</span>
            </th>
            <th>
                <span onClick={() => setOrder("duration")}>DURATION</span>
            </th>
        </tr>
    );
};

export default ListHeader;
