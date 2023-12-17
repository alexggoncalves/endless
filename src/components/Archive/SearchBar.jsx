import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState();

    const updateInput = (event) => {
        setSearchInput(event.target.value);
    };


    return (
        <>
            <input onChange={updateInput} type="text" />
        </>
    );
};

export default SearchBar;
