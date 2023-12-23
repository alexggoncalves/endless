import CheckboxFilter from "./CheckboxFilter";
// import useFilters from "./useFilters";

const GenreFilter = () => {
    // const clearFilter = useFilters((state)=>state.clearFilter)

    return (
        <div className="filter-tab">
            <span className="filter-category">GENRE</span>
            {/* <span className="filter-clear" onClick={clearFilter('genre')}>clear</span> */}
            <div className="filter-list">
                <CheckboxFilter type="genre" value="Pop" />
                <CheckboxFilter type="genre" value="Rock" />
                <CheckboxFilter type="genre" value="Hip-hop/Rap" />
                <CheckboxFilter type="genre" value="Electronic/Dance" />
 
            </div>
        </div>
    );
};

export default GenreFilter;
