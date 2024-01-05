import { useContext } from "react";
import CheckboxFilter from "./CheckboxFilter";
import { MusicContext } from "../../contexts/MusicContext";
import { v4 as uuidv4 } from "uuid";

const GenreFilter = () => {
    const { languages,clearFilter } = useContext(MusicContext);

    return (
        <div className="filter-tab">
            <div className="filter-tab-header">
                <span className="filter-category">LANGUAGE</span>
                <span className="filter-clear" onClick={()=>clearFilter("language")}>clear</span>
            </div>
            <div className="filter-list">
                {languages.map((language) => 
                    <CheckboxFilter key={uuidv4()} type="language" value={language} />
                )}
            </div>
        </div>
    );
};

export default GenreFilter;
