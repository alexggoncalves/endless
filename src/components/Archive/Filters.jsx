import { useState } from "react";
import CheckboxFilter from "./CheckboxFilter";

const Filters = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <>
            <div className={`outside-filters${!visible ? " hidden" : ""}`} onClick={toggleVisibility}></div>
            <div className="filters-button" onClick={toggleVisibility}>
                FILTERS
                <span className="filters-indicator"></span>
            </div>
            <div className={`filters-container${!visible ? " hidden" : ""}`}>
                <div className="filter-tab">
                    <div className="filter-category">GENRE</div>
                    <div className="filter-list">
                        <CheckboxFilter value="Pop" />
                        <CheckboxFilter value="Rock" />
                        <CheckboxFilter value="Hip-hop/Rap" />
                        <CheckboxFilter value="Electronic/Dance" />
                        <CheckboxFilter value="Pop" />
                        <CheckboxFilter value="Rock" />
                        <CheckboxFilter value="Hip-hop/Rap" />
                        <CheckboxFilter value="Electronic/Dance" />
                        <CheckboxFilter value="Pop" />
                        <CheckboxFilter value="Rock" />
                        <CheckboxFilter value="Hip-hop/Rap" />
                        <CheckboxFilter value="Electronic/Dance" />
                    </div>
                </div>

                <div className="filter-tab">
                    <span className="filter-category">LANGUAGE</span>
                </div>
                <div className="filter-tab">
                    <span className="filter-category">RELEASE YEAR</span>
                </div>
            </div>
        </>
    );
};

export default Filters;
