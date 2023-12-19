import { useState } from "react";

const CheckboxFilter = ({ value }) => {
    const [active, setActive] = useState(false);

    const toggleFilter = () => {
        setActive(!active)
    }

    return (
        <div className="checkbox-filter" onClick={toggleFilter}>
            {value}

            <span className="checkbox">
                <span className={`checkbox-fill${!active ? " hidden" : ''}`}></span>
            </span>
        </div>
    );
};

export default CheckboxFilter;
