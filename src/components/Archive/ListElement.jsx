import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getAlbumByID, getArtistByID } from "../apiService.js";

const ListElement = ({ song }) => {
    const [artistName, setArtistName] = useState("");
    const [albumName, setAlbumName] = useState("");
    const navigate = useNavigate();

    const navigateToSong = () => {
        navigate(`/archive/${song.id}`);
    };

    useEffect(() => {
        let artistName = "";
        for (let i = 0; i < song.metadata.artist.length; i++) {
            getArtistByID(song.metadata.artist[i]).then((artist) => {
                console.log(artist)
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
        <tr onClick={navigateToSong}>
            <td>
                <img
                    className="archive-image"
                    src={song.metadata.thumbnail.imgix_url}
                    alt={song.title + " cover art"}
                />
            </td>
            <td>
                <div className="song-title">{song.title}</div>
                <div>{artistName}</div>
            </td>
            <td>{albumName}</td>
            <td>{song.metadata.genre}</td>
            <td>{song.metadata.year}</td>
            <td>{song.metadata.duration}</td>
        </tr>
    );
};

export default ListElement;
