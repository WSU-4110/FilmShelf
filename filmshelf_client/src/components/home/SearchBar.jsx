import React, {useState } from 'react'
import "./SearchBar.css"

export const Searchbar = ({setResults}) => {
    const [input, setInput] = useState("")


    const fetchData = (value) =>{
        fetch("").then((response) => response.json()).then(json => {const results = json.filter((movies) => {
            return( 
            value && 
            movies  && 
            movies.name && 
            movies.name.toLowerCase().includes(value) /*Did not need to fucking do this do to backend job */
            );
        });
        setResults(results);
        });
    };

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }
/* Stopped video here for this part https://youtu.be/sWVgMcz8Q44?si=CEF-zNFzJkc-aSAA&t=824 */
  return (
    <div className='input-wrapper'>SearchBar/*Find a way to make this a custom icon*/
        <input placeholder='Type to search.....'value={input} onChange={(e) => handleChange(e.target.value)} />
    </div>
  )
}
