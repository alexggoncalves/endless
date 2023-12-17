import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { getAlbumByID, getArtistByID } from "../apiService.js";

const ListElement = ({ song }) => {
    const [artistName, setArtistName] = useState("");
    const [albumName, setAlbumName] = useState("");

    useEffect(() => {
        let artistName = "";
        for (let i = 0; i < song.metadata.artist.length; i++) {
            getArtistByID(song.metadata.artist[i]).then((artist) => {
                if (i == song.metadata.artist.length - 1) {
                    artistName += artist.title;
                } else artistName += artist.title + ", ";

                setArtistName(artistName);
            });
        }
    }, []);
    useEffect(() => {
        getAlbumByID(song.metadata.album).then((album) => {
            setAlbumName(album.title);
        });
    }, []);

    return (
        <div className="list-element">
            <img
                src={song.metadata.thumbnail.imgix_url}
                alt={song.title + " cover art"}
            />
            <div>
                <span>{song.title}</span>
                <span>{artistName}</span>
            </div>
            <div>{song.title}</div>
            <div>{song.metadata.genre}</div>
            <div>{song.metadata.duration}</div>
        </div>
    );
};

export default ListElement;
