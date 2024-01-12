import { useContext, useState} from "react";
import { MusicContext } from "../../contexts/MusicContext";

const CheckboxFilter = ({ type, value }) => {
    let {addFilter,removeFilter,selectedFilters} = useContext(MusicContext)
    let [mouseOverFilter,setMouseOverFilter] = useState(false)
    const toggleFilter = () => {
        if (selectedFilters[type].includes(value)) {
            removeFilter(type, value);
        } else {
            addFilter(type, value);
        }
    };

    return (
        <div className="checkbox-filter" onClick={toggleFilter} onMouseEnter={()=>setMouseOverFilter(true)} onMouseLeave={()=>setMouseOverFilter(false)}>
            <span className={`${mouseOverFilter? 'underline': undefined}`}>{value}</span>
            <span className="checkbox">
                <span
                    className={`checkbox-fill${!selectedFilters[type].includes(value) ? " hidden" : ""}`}
                ></span>
            </span>
        </div>
    );
};

export default CheckboxFilter;
