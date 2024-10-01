import React, { useState } from "react";
import React from "react";
import "./Search.css";
import { SearchResultsList } from "./SearchResultsList";
import { Searchbar } from "./Searchbar";


function SearchBar() {

    const [results, setResults] = useState([]);
    return (
        <div classname="Search">
            <div classname="Search-Bar-Container">
                <Searchbar setResults={setResults}/>
                <SearchResultsList results ={results}/>
            </div>
        </div>
    );
}

export default Search;

/*From Videohttps://www.youtube.com/watch?v=sWVgMcz8Q44&t app is the search here */