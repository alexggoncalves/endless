import { useContext } from "react";
import { MusicContext } from "../../contexts/MusicContext";
import CheckboxFilter from "./CheckboxFilter";
import { v4 as uuidv4 } from "uuid";

const YearFilter = () => {
    const { releaseYears, clearFilter } = useContext(MusicContext);

    

    return (
        <div className="filter-tab">
            <div className="filter-tab-header">
                <span className="filter-category">RELEASE YEAR</span>
                <span className="filter-clear" onClick={()=>clearFilter("year")}>clear</span>
            </div>
            <div className="filter-list">
                {releaseYears.map((year) => (
                    <CheckboxFilter key={uuidv4()} type="year" value={year} />
                ))}
            </div>
        </div>
    );
};

export default YearFilter;
