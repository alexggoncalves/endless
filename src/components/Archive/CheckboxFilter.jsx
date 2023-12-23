import { useState } from "react";
import useFilters from "./useFilters";

const CheckboxFilter = ({ type, value }) => {
    const [active, setActive] = useState(false);
    const filters = useFilters((state) => state.filters);

    const addFilter = useFilters((state) => state.addFilter);
    const removeFilter = useFilters((state) => state.removeFilter);

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
