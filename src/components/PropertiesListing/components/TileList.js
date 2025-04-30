import React, { useEffect, useState } from "react";
import { useTypesense } from "../context/TypesenseContext";
import Pagination from "../../Pagination/Pagination";
import Tile from "./Tile";

export default function TileList() {
  const { results, getGroupedDetailsByIds } = useTypesense();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    // Reset to first page when results change (filters applied)
    setCurrentPage(1);
  }, [results?.found_docs]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!results?.hits?.length) return;
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      // Ensure we don't go beyond available results
      if (startIndex >= results.hits.length) {
        setCurrentPage(1);
        return;
      }
      
      const endIndex = Math.min(startIndex + itemsPerPage, results.hits.length);
      const ids = results.hits.slice(startIndex, endIndex).map((hit) => hit.groupKey);
      
      if (ids.length > 0) {
        const details = await getGroupedDetailsByIds(ids);
        setCurrentItems(details || []);
      } else {
        setCurrentItems([]);
      }
    };
    
    setTimeout(() => {
      fetchDetails();
    }, 500);
  }, [results, getGroupedDetailsByIds, currentPage]);

  if (!results || !results.hits) return null;
  if (results.hits?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No results found
      </div>
    );
  }

  // Calculate total pages
  const totalPages = Math.ceil(results.hits.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <>
    
        {currentItems.map((hit) => (
          <Tile key={hit.id} property={hit}></Tile>
        ))}
     
      <Pagination
        pageCount={totalPages}
        handlePageClick={handlePageClick}
        currentPage={currentPage - 1}
      />
    </>
  );
}
