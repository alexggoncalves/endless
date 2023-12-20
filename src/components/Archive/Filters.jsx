import { useState} from "react";
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
                        <CheckboxFilter type='genre' value="Pop" />
                        <CheckboxFilter type='genre' value="Rock" />
                        <CheckboxFilter type='genre' value="Hip-hop/Rap" />
                        <CheckboxFilter type='genre' value="Electronic/Dance" />
                        <CheckboxFilter type='genre' value="Pop" />
                        <CheckboxFilter type='genre' value="Rock" />
                        <CheckboxFilter type='genre' value="Hip-hop/Rap" />
                        <CheckboxFilter type='genre' value="Electronic/Dance" />
                        <CheckboxFilter type='genre' value="Pop" />
                        <CheckboxFilter type='genre' value="Rock" />
                        <CheckboxFilter type='genre' value="Hip-hop/Rap" />
                        <CheckboxFilter type='genre' value="Electronic/Dance" />
                    </div>
                </div>

                <div className="filter-tab">
                    <span className="filter-category">LANGUAGE</span>
                    <div className="filter-list">
                    <CheckboxFilter type='language' value="Portuguese" />
                    <CheckboxFilter type='language' value="English" />
                    </div>
                </div>
                <div className="filter-tab">
                    <span className="filter-category">RELEASE YEAR</span>
                    <div className="filter-apply black-bg white-text">APPLY FILTERS</div>
                </div>
            </div>
        </>
    );
};

export default Filters;
