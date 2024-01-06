import { useNavigate } from "react-router-dom";

const ListElement = ({ song }) => {
    const navigate = useNavigate();

    const navigateToSong = () => {
        navigate(`/endless/archive/${song.id}`);
    };

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
                <div>{song.metadata.artist[0].title}</div>
            </td>
            <td  className="hide-in-mobile">{song.metadata.album.title}</td>
            <td>{song.metadata.genre}</td>
            <td>{song.metadata.year}</td>
            <td className="hide-in-mobile">{song.metadata.duration}</td>
        </tr>
    );
};

export default ListElement;
