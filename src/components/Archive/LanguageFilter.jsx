import { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";

const GenreFilter = () => {

    
    return (
        <div className="filter-tab">
            <span className="filter-category">LANGUAGE</span>
            <div className="filter-list">
                <CheckboxFilter type="language" value="Portuguese" />
                <CheckboxFilter type="language" value="English" />
            </div>
        </div>
    );
};

export default GenreFilter;
