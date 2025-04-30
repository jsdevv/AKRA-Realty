import React, { useEffect, useRef, useState } from "react";
import typesense from "../lib/typesense";
import { useTypesense } from "../context/TypesenseContext";
import { FaSearch } from "react-icons/fa";
import "./Autocomplete.css";

const Autocomplete = () => {
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { updateQuery, setHitLocation } = useTypesense();

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await typesense.typesenseClient
          .collections("properties")
          .documents()
          .search({
            q: query,
            query_by:
              "projectName,propertyName,propertyState,propertyCity,propertyZipCode,propertyCardLine2,propertyCardLine3,propertyAddress1,propertyAddress2,locality",
            limit: 250,
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
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.projectName);
    setSuggestions([]);
    updateQuery(item.projectName);
    setHitLocation(item);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    updateQuery('*');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSuggestions([]);
      updateQuery(query);
    }
  };

  return (
    <div ref={containerRef} className="autocomplete-container">
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim() === "") {
              handleClear();
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Address City, Pin Code"
          className="autocomplete-input"
        />
        <div className="autocomplete-clear-button">
        {query && (
          <button
            type="button"
            
            onClick={handleClear}
          >
            ✕
          </button>
        )}
        <button
        className="btn-search"
            type="button"
            onClick={() => {
              setSuggestions([]);
              updateQuery(query);
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
