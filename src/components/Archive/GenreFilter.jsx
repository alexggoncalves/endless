import { useContext } from "react";
import CheckboxFilter from "./CheckboxFilter";
import { MusicContext } from "../../contexts/MusicContext";
import { v4 as uuidv4 } from "uuid";

const GenreFilter = () => {
    const { genres,clearFilter } = useContext(MusicContext);

    return (
        <div className="filter-tab">
            <div className="filter-tab-header">
                <span className="filter-category">GENRE</span>
                <span className="filter-clear" onClick={()=>clearFilter("genre")}>clear</span>
            </div>

            <div className="filter-list">
                {genres.map((genre) => (
                    <CheckboxFilter key={uuidv4()} type="genre" value={genre} />
                ))}
            </div>
        </div>
    );
};

export default GenreFilter;
