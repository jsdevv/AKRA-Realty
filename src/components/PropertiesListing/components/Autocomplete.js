import React, { useEffect, useRef, useState } from "react";
import typesense from "../lib/typesense";
import { useTypesense } from "../context/TypesenseContext";
import { FaSearch } from "react-icons/fa";
import "./Autocomplete.css";

const Autocomplete = ({herosearch}) => {
  const containerRef = useRef(null);
  const { query, updateQuery, setHitLocation } = useTypesense();
  const [searchQuery, setSearchQuery] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await typesense.typesenseClient
          .collections("properties")
          .documents()
          .search({
            q: searchQuery,
            query_by:
              "projectName,propertyName,propertyState,propertyCity,propertyZipCode,locality",
            limit: 250,
            query_by_weights: "10,10,1,1,1,1",
            include_fields: "projectName,propertyName,locality,location",
          });

        const projectLocalityCombinations = {};
        
        response.hits.forEach(hit => {
          const projectName = hit.document.projectName?.replace(/_/g, " ") || "";
          const propertyName = hit.document.propertyName?.replace(/_/g, " ") || projectName;
          const locality = hit.document.locality || "";
          const location = hit.document.location;
          
          const key = `${projectName}-${locality}`;
          
          if (!projectLocalityCombinations[key]) {
            projectLocalityCombinations[key] = {
              projectName,
              propertyName,
              locality,
              location,
              value: projectName, 
            };
          }
        });
        
        const items = Object.values(projectLocalityCombinations);
        
        setSuggestions(items);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  const handleSelect = (item) => {
    setSearchQuery(item.projectName);
    setSuggestions([]);
    updateQuery(item.projectName);
    setHitLocation(item);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    updateQuery('*');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSuggestions([]);
      updateQuery(searchQuery);
    }
  };

  return (
    <div ref={containerRef} className="autocomplete-container">
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          value={searchQuery === '*' ? '' : searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() === "") {
              handleClear();
            }
            if(herosearch){
              updateQuery(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Address City, Pin Code"
          className={herosearch? 'search-field' : 'autocomplete-input'}
        />
        <div className="autocomplete-clear-button">
        {searchQuery && !herosearch && (
          <button
            type="button"
            
            onClick={handleClear}
          >
            ✕
          </button>
        )}
        <button
        className={herosearch? 'search-icon11' : "btn-search"}
            type="button"
            onClick={() => {
              setSuggestions([]);
              updateQuery(searchQuery);
            }}
          >
             <FaSearch />
          </button>
          </div>
      </div>
      { isFocused && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(item)}
              className="autocomplete-suggestion-item"
            >
             <span> {item.propertyName || item.projectName}</span>
             <span className="autosuggest-locality"> {item.locality}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
