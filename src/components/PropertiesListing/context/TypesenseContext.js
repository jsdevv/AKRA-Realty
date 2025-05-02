import React, { createContext, useContext, useState, useEffect } from "react";
import typesense from "../lib/typesense"; // Import your Typesense client

// Create the context
const TypesenseContext = createContext();
export const prices = [
  { value: [0, 1000000], label: "Below ₹ 10L", minPrice: 0, maxPrice: 1000000 },
  {
    value: [1000000, 5000000],
    label: "₹ 10L - ₹ 50L",
    minPrice: 1000000,
    maxPrice: 5000000,
  },
  {
    value: [5000000, 10000000],
    label: "₹ 50L - ₹ 1Cr",
    minPrice: 5000000,
    maxPrice: 10000000,
  },
  {
    value: [10000000, 20000000],
    label: "₹ 1Cr - ₹ 2Cr",
    minPrice: 10000000,
    maxPrice: 20000000,
  },
  {
    value: [20000000, 40000000],
    label: "₹ 2Cr - ₹ 4Cr",
    minPrice: 20000000,
    maxPrice: 40000000,
  },
  {
    value: [40000000, 60000000],
    label: "₹ 4Cr - ₹ 6Cr",
    minPrice: 40000000,
    maxPrice: 60000000,
  },
  {
    value: [60000000, 100000000],
    label: "₹ 6Cr - ₹ 10Cr",
    minPrice: 60000000,
    maxPrice: 100000000,
  },
  {
    value: [100000000, 150000000],
    label: "₹ 10Cr - ₹ 15Cr",
    minPrice: 100000000,
    maxPrice: 150000000,
  },
  {
    value: [150000000, 200000000],
    label: "₹ 15Cr - ₹ 20Cr",
    minPrice: 150000000,
    maxPrice: 200000000,
  },
  {
    value: [200000000, 999999999],
    label: "Above ₹ 20Cr",
    minPrice: 200000000,
    maxPrice: 999999999,
  },
];

// Provider component
export const TypesenseProvider = ({ children }) => {
  const [query, setQuery] = useState("*");
  const [filters, setFilters] = useState({
    // propertyStatus: 'For Sale'
  });
  const [results, setResults] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const [markedItem, setMarkedItem] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);
  const [propertyToOpen, setPropertyToOpen] = useState(null);
  const [facetData, setFacetData] = useState(null);
  const [facetStats, setFacetStats] = useState(null);
  const [hitLocation, setHitLocation] = useState(null);

  const formatCurrency = (value) => {
    if (value < 1000) return value.toString();
    if (value < 100000) return `${(value / 1000).toFixed(2)} K`;
    if (value < 10000000) return `${(value / 100000).toFixed(2)} L`;
    return `${(value / 10000000).toFixed(2)} Cr`;
  };

  // New function to format square feet based on property type
  const formatSqFt = (value, propertyType, includeUnit = true) => {
    if (!value) return "N/A";
    
    const propType = propertyType?.toLowerCase();
    
    if (!propType) {
      return includeUnit ? `${value.toLocaleString()} SqFt` : `${value.toLocaleString()}`;
    }
    
    if (propType === "farm lands") {
      const acres = (value / 43560).toFixed(2); // 1 Acre = 43,560 SqFt
      return includeUnit ? `${acres} Acres` : `${acres}`;
    }
    
    const sqydTypes = ["lands", "plots"];
    if (sqydTypes.includes(propType)) {
      const sqYds = (value / 9).toFixed(2); // 1 SqYd = 9 SqFt
      return includeUnit ? `${Number(sqYds).toLocaleString()} SqYds` : `${Number(sqYds).toLocaleString()}`;
    }
    
    return includeUnit ? `${value.toLocaleString()} SqFt` : `${value.toLocaleString()}`;
  };

  const formatMinMax = (min, max, unit = "") => {
    if (min && max && min !== max) {
      return `${min} - ${max} ${unit}`.trim();
    }
    if (min) {
      return `${min} ${unit}`.trim();
    }
    if (max) {
      return `${max} ${unit}`.trim();
    }
    return "";
  };

  // Function to perform a search
  const search = async () => {
    //setIsLoading(true);
    try {
      const PAGE_SIZE = 250;

      // First request to get total count and first page
      const initialResults = await typesense.typesenseClient
        .collections("properties")
        .documents()
        .search({
          q: query,
          filter_by: Object.entries(filters)
            .map(([key, value]) => `${key}:${value}`)
            .filter((f) => !f.endsWith("[]") && !f.trim().endsWith(":"))
            .map((f) => `(${f})`)
            .join(" && "),
          query_by:
            "projectName,propertyName,propertyState,propertyCity,propertyZipCode,locality",
          query_by_weights: "10,10,1,1,1,1",
          limit: PAGE_SIZE,
          page: 1,
          num_typos: 0,
          group_by: "projectName",
          group_limit: 99,
          sort_by: "projectOrderID:asc",
          include_fields: "location,id,amount",
        });

      setTotalResults(initialResults.found_docs);

      // Calculate total pages needed
      const totalPages = Math.ceil(initialResults.found_docs / PAGE_SIZE);
      let allResults = initialResults;

      // If we need more pages, fetch them sequentially
      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          try {
            const pageResult = await typesense.typesenseClient
              .collections("properties")
              .documents()
              .search({
                q: query,
                filter_by: Object.entries(filters)
                  .map(([key, value]) => `${key}:${value}`)
                  .filter((f) => !f.endsWith("[]") && !f.trim().endsWith(":"))
                  .map((f) => `(${f})`)
                  .join(" && "),
                query_by: "projectName,propertyName,propertyState,propertyCity,propertyZipCode,locality",
                query_by_weights: "10,10,1,1,1,1",
                limit: PAGE_SIZE,
                page: page,
                num_typos: 0,
                group_by: "projectName",
                group_limit: 99,
                sort_by: "projectOrderID:asc",
                include_fields: "location,id,amount",
              });

            if (pageResult.grouped_hits && pageResult.grouped_hits.length > 0) {
              allResults.grouped_hits = [
                ...allResults.grouped_hits,
                ...pageResult.grouped_hits,
              ];
            } else {
              break;
            }
          } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
          }
        }
      }

      if (allResults.grouped_hits) {
        allResults.hits = allResults.grouped_hits
          .map((group) => {
            group.hits = group.hits.sort((a, b) => a.document.amount - b.document.amount).map((hit) => {
              hit.document.found = group.found;
              hit.document.groupKey = group.group_key[0];
              return hit;
            });
            return group.hits.slice(0, 1); // Get only the first hit from each group
          })
          .flat()
          .map((hit) => {
            const doc = hit.document;
            doc.formattedAmount = formatCurrency(doc.amount || 0);

            return doc;
          });
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupedDetailsByIds = async (ids) => {
    const appliedFiltersfilters = Object.entries(filters)
      .map(([key, value]) => `${key}:${value}`)
      .filter((f) => !f.endsWith("[]") && !f.trim().endsWith(":"))
      .join(" && ");
    const groupedDetails = await typesense.typesenseClient
      .collections("properties")
      .documents()
      .search({
        q: "*",
        filter_by: `projectName:=[${ids.join(
          ","
        )}] && ${appliedFiltersfilters}`,
        query_by:
          "projectName,propertyName,propertyState,propertyCity,propertyZipCode,propertyCardLine2,propertyCardLine3,propertyAddress1,propertyAddress2,locality",
        limit: 250,
        //facet_by: "propertyStatus,propertyType,projectName,customStatus",
        group_by: "projectName",
        group_limit: 99,
        sort_by: "projectOrderID:asc",
      });

    return groupedDetails.grouped_hits.map((group) => {
      group.hits = group.hits.map((hit) => {
        hit.document.found = group.found;
        hit.document.formattedAmount = formatCurrency(hit.document.amount || 0);
        return hit;
      });
      const firstHit = group.hits[0].document;
      firstHit.relatedUnits = group.hits.map((hit) => hit.document);
      const stats = group.hits.reduce(
        (acc, hit) => {
          const { amount, bedrooms, sqFt, propertyType, areaUnit } = hit.document;
          acc.minAmount = Math.min(acc.minAmount, amount);
          acc.maxAmount = Math.max(acc.maxAmount, amount);
          acc.minBedrooms = Math.min(acc.minBedrooms, bedrooms);
          acc.maxBedrooms = Math.max(acc.maxBedrooms, bedrooms);
          acc.minSqFt = Math.min(acc.minSqFt, sqFt);
          acc.maxSqFt = Math.max(acc.maxSqFt, sqFt);
          acc.propertyType = propertyType; // Store propertyType for area formatting
          acc.areaUnit = areaUnit;
          return acc;
        },
        {
          minAmount: Infinity,
          maxAmount: -Infinity,
          minBedrooms: Infinity,
          maxBedrooms: -Infinity,
          minSqFt: Infinity,
          maxSqFt: -Infinity,
          propertyType: "",
          areaUnit: "",
        }
      );

      


      const formattedProps = {
        formattedAmount: formatMinMax(
          formatCurrency(stats.minAmount),
          formatCurrency(stats.maxAmount)
        ),
        formattedBedrooms: formatMinMax(
          stats.minBedrooms,
          stats.maxBedrooms,
          "BHK"
        ),
        formattedSqFt: (() => {
          const minFormatted = stats.minSqFt?.toLocaleString();
          const maxFormatted = stats.maxSqFt?.toLocaleString();
          const unitType = stats.areaUnit
          // Return in the format {min} - {max} {unittype}
          if (stats.minSqFt === stats.maxSqFt) {
            return `${minFormatted} ${unitType}`;
          } else {
            return `${minFormatted} - ${maxFormatted} ${unitType}`;
          }
        })(),
      };

      formattedProps.propertyDetails = [
        firstHit.propertyType,
        formattedProps.formattedBedrooms,
        formattedProps.formattedSqFt,
      ]
        .filter((x) => x)
        .join(" | ");

      formattedProps.propertyAddressLine = [
        firstHit.locality,
        firstHit.propertyState,
        firstHit.propertyZipCode,
      ].filter((x) => x)
      .join(" | ");;
      formattedProps.tooltip1 = [
        firstHit.propertyType,
        formattedProps.formattedAmount,
      ]
        .filter((x) => x)
        .join(" | ");

      formattedProps.tooltip2 = [
        formattedProps.formattedBedrooms,
        formattedProps.formattedSqFt,
      ]
        .filter((x) => x)
        .join(" | ");

      return {
        ...firstHit,
        ...stats,
        ...formattedProps,
      };
    });
  };

  const priceRanges = prices
    .map((range) => `${range.label}:[${range.minPrice},${range.maxPrice}]`)
    .join(",");

  const priceFacet = `amount(${priceRanges})`;

  const loadFacets = async () => {
    const facets = await typesense.typesenseClient
      .collections("properties")
      .documents()
      .search({
      q: "*",
      query_by: "companyName",
      filter_by: "isPremiumProject:=Y",
      limit: 1,
      facet_by: `companyName`, //`propertyStatus,propertyType,customStatus,${priceFacet}`,
      include_fields: "id",
      max_facet_values: 100,
      });

    const facetsData = facets.facet_counts.reduce((acc, facet) => {
      const facetName = facet.field_name;
      const facetValues = facet.counts.map((value) => ({
        value: value.value,
        count: value.count,
        isRefined: false,
      }));
      acc[facetName] = facetValues;
      return acc;
    }, {});
    setFacetData(facetsData);

    const stats = facets.facet_counts.reduce((acc, facet) => {
      const stat = facet.stats;
      const statName = stat.field_name;
      acc[statName] = stat;
      return acc;
    }, {});
    setFacetStats(stats);
  };

  const openPropertyModal = async (property) => {
    setPropertyToOpen(property);
  };

  const closePropertyModal = () => {
    setPropertyToOpen(null);
  };

  // Function to update the query
  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  const updateItemForMarker = async (key) => {
    if (!key) {
      setMarkedItem(null);
      return;
    }
    const item = await getGroupedDetailsByIds([key]);
    if (!item || item.length === 0) {
      setMarkedItem(null);
      return;
    }
    setMarkedItem(item[0]);
  };

  const clearItemForMarker = () => {
    setMarkedItem(null);
  };

  // Function to update filters
  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  // Function to update geolocation
  const updateGeoLocation = (northEastsouthWest) => {
    updateFilters({ location: "(" + northEastsouthWest.join(",") + ")" });
  };

  // Function to clear geolocation filter
  const clearGeoLocation = () => {
    setGeoLocation(null);
  };

  useEffect(() => {
    loadFacets();
  }, []); // Add an empty dependency array to ensure this runs only once on mount

  // Perform a search whenever the query or filters change
  useEffect(() => {
    if (query && Object.keys(filters).length) {
      search();
    }
  }, [query, filters]);

  return (
    <TypesenseContext.Provider
      value={{
        query,
        filters,
        geoLocation,
        results,
        isLoading,
        totalResults,
        markedItem,
        propertyToOpen,
        facetData,
        facetStats,
        hitLocation,
        setHitLocation,
        updateQuery,
        updateFilters,
        updateGeoLocation,
        clearGeoLocation,
        getGroupedDetailsByIds,
        updateItemForMarker,
        clearItemForMarker,
        closePropertyModal,
        openPropertyModal,
      }}
    >
      {children}
    </TypesenseContext.Provider>
  );
};

// Custom hook to use the Typesense context
export const useTypesense = () => {
  const context = useContext(TypesenseContext);
  if (!context) {
    throw new Error("useTypesense must be used within a TypesenseProvider");
  }
  return context;
};

export const useGeoSearch = () => {
  const { geoLocation, updateGeoLocation, clearGeoLocation } = useTypesense();

  return {
    geoLocation,
    updateGeoLocation,
    clearGeoLocation,
  };
};

export const useMenu = ({ attribute, sortBy = ["name"], options }) => {
  const { facetData, updateFilters } = useTypesense();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (options) {
      const fetchedItems = options.map((facet, index) => ({
        value: facet,
        label: facet,
        isRefined: index === 0,
      }));

      setItems(fetchedItems);
      return;
    }
    if (facetData && facetData[attribute]) {
      const fetchedItems = facetData[attribute].map((facet) => ({
        value: facet.value,
        label: facet.value,
        count: facet.count,
        isRefined: false,
      }));

      const sortedItems = fetchedItems.sort((a, b) => {
        if (sortBy.includes("name")) {
          return a.label.localeCompare(b.label);
        }
        return 0;
      });

      setItems(sortedItems);
    }
  }, [facetData]);

  const refine = (value) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isRefined: item.value === value, // Only one item can be selected
      }))
    );

    const selectedValue =
      items.find((item) => item.value === value)?.value || "";
    updateFilters({ [attribute]: selectedValue });
  };

  return { items, refine };
};

export const useRefinementList = ({
  attribute,
  sortBy = ["name"],
  options,
}) => {
  const { facetData, updateFilters } = useTypesense();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (options) {
      const fetchedItems = options.map((facet) => ({
        value: facet,
        label: facet,
        isRefined: false,
      }));

      setItems(fetchedItems);
      return;
    }
    if (facetData && facetData[attribute]) {
      const fetchedItems = facetData[attribute].map((facet) => ({
        value: facet.value,
        label: facet.value,
        count: facet.count,
        isRefined: false,
      }));

      const sortedItems = fetchedItems.sort((a, b) => {
        if (sortBy.includes("count")) {
          return b.count - a.count; // Sort by count in descending order
        } else if (sortBy.includes("name")) {
          return a.label.localeCompare(b.label);
        }
        return 0;
      });

      setItems(sortedItems);
    }
  }, [facetData]);

  const refine = (value) => {
    const updatedItems = items.map((item) => ({
      ...item,
      isRefined: item.value === value ? !item.isRefined : item.isRefined, // Toggle the refinement state
    }));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.value === value
          ? { ...item, isRefined: !item.isRefined } // Toggle the refinement state
          : item
      )
    );

    const selectedValues = updatedItems
      .filter((item) => item.isRefined)
      .map((item) => item.value);

    updateFilters({ [attribute]: `[${selectedValues.join(",")}]` });
  };

  return { items, refine };
};

export const useCustomList = ({ attribute, options, isNumericRange }) => {
  const { facetStats, updateFilters } = useTypesense();
  const [items, setItems] = useState([]);
  const [minMax, setMinMax] = useState({ min: null, max: null });

  useEffect(() => {
    if (options) {
      const fetchedItems = options.map((facet) => ({
        value: facet.value,
        label: facet.label,
        count: facet.count,
        isRefined: false,
      }));

      setItems(fetchedItems);
    }

    if (facetStats && facetStats[attribute]) {
      const stats = facetStats[attribute];
      const min = stats.min;
      const max = stats.max;
      setMinMax({ min, max });
    }
  }, [options]);

  const refine = (value) => {
    const updatedItems = items.map((item) => ({
      ...item,
      isRefined: item.value === value ? !item.isRefined : item.isRefined, // Toggle the refinement state
    }));
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.value === value
          ? { ...item, isRefined: !item.isRefined } // Toggle the refinement state
          : item
      )
    );

    const selectedValues = updatedItems
      .filter((item) => item.isRefined)
      .map((item) => item.value);

    if (isNumericRange) {
      const numericConditions = selectedValues.map((item) => {
        const [min, max] = item;
        const conditions = [];
        if (min != null) conditions.push(`${attribute}:>=${min}`);
        if (max != null) conditions.push(`${attribute}:<=${max}`);
        return conditions.join(" && ");
      });

      // Multiple ranges should be joined with OR (`||`)
      const filterString = numericConditions.join(" || ");

      // remove first occurnace of string {attribute}
      const filterStringWithAttribute = filterString.replace(
        `${attribute}:`,
        ""
      );
      updateFilters({ [attribute]: filterStringWithAttribute });
      return;
    }
    updateFilters({ [attribute]: `[${selectedValues.join(",")}]` });
  };

  return { items, refine, minMax };
};

export const useToggleFilter = ({ attribute, defaultChecked = false }) => {
  const { updateFilters } = useTypesense();
  const [value, setValue] = useState(defaultChecked);

  const toggle = () => {
    const newValue = !value;
    setValue(newValue);
    
    // For premium project filter, we use Y/N values
    if (attribute === "isPremiumProject") {
      updateFilters({ [attribute]: newValue ? "Y" : "" });
    } else {
      updateFilters({ [attribute]: newValue.toString() });
    }
  };

  return { value, toggle };
};
