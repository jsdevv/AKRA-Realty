import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { MultiFilterModule,SetFilterModule } from 'ag-grid-enterprise'; 
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyViews } from "../../utils/fetchPropertyViews";
import { usePropertyFavorite } from "../../customHooks/usePropertyFavorite";
import "./PropertyGrid.css"
import { setCameFromDetails } from "../../Redux/Slices/propertySlice";

ModuleRegistry.registerModules([AllCommunityModule,MultiFilterModule,SetFilterModule ]);

const PropertyGrid = ({ groupedByBedroomsArray,selectedBedrooms,setSelectedPropertyForDetailHandler }) => {
 
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { favorites,favoriteColor, toggleFavorite } = useFavorites();
    const [localFavorites, setLocalFavorites] = useState(favorites); 
    const dispatch = useDispatch();
    
    // Filter and clean the grouped array
    const cleanedGroupedByBedroomsArray = useMemo(() => {
        if (!Array.isArray(groupedByBedroomsArray)) return [];
        return groupedByBedroomsArray.filter(group => 
            group?.properties?.length > 0
        );
    }, [groupedByBedroomsArray]);
    

    const defaultColDef = useMemo(() => ({
        sortable: true,

        resizable: true,
        cellStyle: { 
            // borderRight: "1px solid #ccc",
            fontSize: "12px",  
            fontWeight: "400",
            fontFamily: "Outfit, sans-serif",
            textAlign:"center"
        },
    }), []);

    const flatData = useMemo(() => {
        if (!cleanedGroupedByBedroomsArray.length) return [];
    
        return cleanedGroupedByBedroomsArray
            .filter(group => 
                !selectedBedrooms || String(group.Bedrooms) === String(selectedBedrooms)
            )
            .flatMap(group =>
                group.properties.map(property => ({
                    Bedrooms: isNaN(Number(group.Bedrooms)) ? "N/A" : Number(group.Bedrooms),
                    PropertyBathrooms: Number(property.PropertyBathrooms) || "N/A",
                    SqFt: property.SqFt,
                    PropertyType: property.PropertyType,
                    PropertyMainEntranceFacing: property.PropertyMainEntranceFacing || "N/A",
                    Amount: property.Amount || "N/A",
                    fullPropertyData: property,
                }))
            );
    }, [cleanedGroupedByBedroomsArray, selectedBedrooms]);
    


    const handlePropertyDetailsview = async (property) => {
        try {
            if (!property || !property.PropertyID) {
                toast.error("Invalid property data");
                return;
            }
            await fetchPropertyViews(dispatch, property.PropertyID, Id, bearerToken);
            dispatch(setCameFromDetails(true));
            setSelectedPropertyForDetailHandler(property); // Update selected property
        } catch (error) {
            toast.error("Failed to fetch project views.");
        }
    };

    const handleToggleFavorite = usePropertyFavorite(localFavorites, toggleFavorite, bearerToken, Id, setLocalFavorites);
    
    const columnDefs = useMemo(() => [
        { 
            headerName: "Type", 
            field: "PropertyType", 
            flex: 0.8,  
            headerClass: "custom-header",
            filter: "agSetColumnFilter", 
        },
        { 
            headerName: "Price", 
            cellStyle: { textAlign: "center" },
            field: "Amount", 
            flex: 0.8, 
            filter: "agSetColumnFilter", 
            cellRenderer: params => params.value !== "N/A" ? (
                <span className="amount-cell">
                    <LiaRupeeSignSolid  style={{fontWeight:"300",fontSize:'11px'}} /> {params.value}
                </span>
            ) : "N/A" ,
             headerClass: "custom-header"
        },
    
        { 
            headerName: "Area", 
            field: "SqFt",
            flex: 0.7, 
            valueFormatter: params => {
                const value = Number(params.value);
                if (!value) return "N/A";
            
                const propertyType = params.data?.PropertyType?.toLowerCase();
            
                if (!propertyType) return `${value.toLocaleString()} SqFt`;
            
                if (propertyType === "farm lands") {
                  const acres = (value / 43560).toFixed(2); // 1 Acre = 43,560 SqFt
                  return `${acres} Acres`;
                }
            
                const sqydTypes = ["lands", "plots"];
                if (sqydTypes.includes(propertyType)) {
                  const sqYds = (value / 9).toFixed(2); // 1 SqYd = 9 SqFt
                  return `${Number(sqYds).toLocaleString()} SqYds`;
                }
            
                return `${value.toLocaleString()} SqFt`;
              },
            filter: "agSetColumnFilter", 
             headerClass: "custom-header"
        },
        { 
          headerName: "Facing", 
          field: "PropertyMainEntranceFacing", 
          flex: 0.8,      
          headerClass: "custom-header",
          filter: "agSetColumnFilter", 
    },

        {
          headerName: "BHK", 
          field: "Bedrooms", 
          flex: 0.6, 
          filter: "agSetColumnFilter",
          valueFormatter: (params) => {
            const value = params.value;
            return value === 0 || value === "0" || value === null || value === undefined ? "N/A" : value;
          }, 
          headerClass: "custom-header" 
        },
        {
            headerName: "Bath", 
            field: "PropertyBathrooms", 
            flex: 0.6, 
            filter: "agSetColumnFilter", 
            headerClass: "custom-header" 
          },
        {
            headerName: "Details",
            field: "fullPropertyData",
            cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" }, 
            flex: 0.6,
            cellRenderer: params => (
                <p 
                   className="details-link"
                      onClick={() => handlePropertyDetailsview(params.value)}       
                >
                    Details
                </p>
            ),
            headerClass: "custom-header"
        },
        {
            headerName: "Action",
            field: "fullPropertyData", // Use fullPropertyData
            flex: 0.6,
            cellStyle: { textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" },
            cellRenderer: params => {
                
                if (!params.value) return "N/A"; // Prevent undefined error
                const isFavorited = localFavorites.some(fav => fav.PropertyID === params.value.PropertyID);
                return (
                    <div style={{ display: "flex", gap: "10px" }}>
                        {/* Heart Icon for Favorite */}
                        <FaHeart
                            className="action-icon"
                            style={{ color: isFavorited ? favoriteColor : "#bbb", cursor: "pointer" }}
                            onClick={() => handleToggleFavorite(params.value)}
                        />

                    </div>
                );
            },
            headerClass: "custom-header"
        }
        
    ], [localFavorites]); 
    
 
    const onGridReady = params => {
        params.api.sizeColumnsToFit();
    };
    

    return (
        <div className="ag-theme-quartz bordered-grid" style={{ height: "300px", width:"100%" }}>
            {flatData.length > 0 ? (
                <AgGridReact
                    rowData={flatData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                 
                    pagination={false}
                    rowBuffer={10}
                    onGridReady={onGridReady}
                    autoSizeStrategy={{ type: "fitGridWidth" }}
                />
            ) : (
                <p style={{ textAlign: "center", padding: "20px" }}>No property data available.</p>
            )}
        </div>
    );
};

export default PropertyGrid;
