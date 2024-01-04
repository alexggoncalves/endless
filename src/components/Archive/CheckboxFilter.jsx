import { useContext} from "react";
import { MusicContext } from "../../contexts/MusicContext";

const CheckboxFilter = ({ type, value }) => {
    let {addFilter,removeFilter,filters} = useContext(MusicContext)

    const toggleFilter = () => {
        if (filters[type].includes(value)) {
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
                    className={`checkbox-fill${!filters[type].includes(value) ? " hidden" : ""}`}
                ></span>
            </span>
        </div>
    );
};

export default CheckboxFilter;
