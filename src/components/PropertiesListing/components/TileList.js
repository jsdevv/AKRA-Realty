import React, { useEffect, useState } from "react";
import { useTypesense } from "../context/TypesenseContext";
import Pagination from "../../Pagination/Pagination";
import Tile from "./Tile";

export default function TileList({setShowAuthPopup}) {
  const { results, getGroupedDetailsByIds } = useTypesense();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchDetails = async () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      if(startIndex >= results.hits.length) {
        setCurrentPage(1);
        return;
      };
      const endIndex = startIndex + itemsPerPage;
      const ids = results.hits.slice(startIndex, endIndex).map((hit) => hit.groupKey);
      const details = await getGroupedDetailsByIds(ids);
      setCurrentItems(details);
    };
    if (results && results.hits && results.hits.length > 0) {
      fetchDetails();
    }
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
