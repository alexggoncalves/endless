import { useState} from "react";
import useFilters from "./useFilters";

const CheckboxFilter = ({ type, value }) => {
    const [active, setActive] = useState(false);

    const filters = useFilters((state)=>state.filters)
    const addFilter = useFilters((state)=>state.addFilter)
    const removeFilter = useFilters((state)=>state.removeFilter)

    const toggleFilter = () => {
        if (active) {
            setActive(false);
            removeFilter(type,value)
            console.log(filters)
        } else {
            setActive(true);
            addFilter(type, value)
            console.log(filters)
        }
    };

    return (
        <div className="checkbox-filter" onClick={toggleFilter}>
            {value}

            <span className="checkbox">
                <span
                    className={`checkbox-fill${!active ? " hidden" : ""}`}
                ></span>
            </span>
        </div>
    );
};

export default CheckboxFilter;
