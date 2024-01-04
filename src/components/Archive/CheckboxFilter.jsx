import { useContext} from "react";
import { MusicContext } from "../../contexts/MusicContext";

const CheckboxFilter = ({ type, value }) => {
    let {addFilter,removeFilter,selectedFilters} = useContext(MusicContext)

    const toggleFilter = () => {
        if (selectedFilters[type].includes(value)) {
            removeFilter(type, value);
        } else {
            addFilter(type, value);
        }
    };

    return (
        <div className="checkbox-filter" onClick={toggleFilter}>
            {value}
            <span className="checkbox">
                <span
                    className={`checkbox-fill${!selectedFilters[type].includes(value) ? " hidden" : ""}`}
                ></span>
            </span>
        </div>
    );
};

export default CheckboxFilter;
