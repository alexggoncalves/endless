import { useContext, useState } from "react";

import GenreFilter from "./GenreFilter";
import LanguageFilter from "./LanguageFilter";
import YearFilter from "./YearFilter";

import { MusicContext } from "../../contexts/MusicContext";

const Filters = ({ toggleFilters, applied }) => {
    const [visible, setVisible] = useState(false);

    const {clearAllFilters} = useContext(MusicContext)

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const handleToggleFilters = () => {
        toggleFilters();
        setVisible(false);
        if(applied) clearAllFilters()
    };

    return (
        <>
            <div
                className={`outside-filters${!visible ? " hidden" : ""}`}
                onClick={toggleVisibility}
            ></div>
            <div className="filters-button" onClick={toggleVisibility}>
                FILTERS
                <span className="filters-indicator">
                    <span
                        className={`filters-indicator-fill${
                            !applied ? " hidden" : ""
                        }`}
                    ></span>
                </span>
            </div>
            <div className={`filters-container${!visible ? " hidden" : ""}`}>
                <GenreFilter></GenreFilter>
                <LanguageFilter></LanguageFilter>
                <YearFilter></YearFilter>
                <div
                    className="filter-apply black-bg white-text"
                    onClick={handleToggleFilters}
                >
                    {!applied ? "APPLY FILTERS" : "REMOVE FILTERS"}
                </div>
            </div>
        </>
    );
};

export default Filters;
