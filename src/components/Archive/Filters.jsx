import { useContext, useState } from "react";

import GenreFilter from "./GenreFilter";
import LanguageFilter from "./LanguageFilter";
import YearFilter from "./YearFilter";

import { MusicContext } from "../../contexts/MusicContext";

const Filters = () => {
    const [visible, setVisible] = useState(false);

    const { clearAllFilters, areFiltersActive, applyFilters, didFiltersChange } =
        useContext(MusicContext);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const applyFiltersToArchive = () => {
        if(didFiltersChange()){
            applyFilters();
            setVisible(false);
        }
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
                            !areFiltersActive() ? " hidden" : ""
                        }`}
                    ></span>
                </span>
            </div>
            <div className={`filters-container${!visible ? " hidden" : ""}`}>
                <GenreFilter></GenreFilter>
                <LanguageFilter></LanguageFilter>
                <YearFilter></YearFilter>
                <div
                    className={`filter-apply black-bg white-text${
                        !didFiltersChange() ? " disabled" : ""
                    }`}
                    onClick={applyFiltersToArchive}
                >
                    APPLY
                </div>
            </div>
        </>
    );
};

export default Filters;
