import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import {
         AllCommunityModule, 
         ModuleRegistry 
        } 
         from "ag-grid-community";
import { MultiFilterModule,SetFilterModule } from 'ag-grid-enterprise'; 
import { LiaRupeeSignSolid } from "react-icons/lia";
import "./PropertyGrid.css"
import { FaHeart, FaStar } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";
import { toast } from "react-toastify";
import {fetchAddpropertyFavorties,  fetchDeletePropertyFavorties } from "../../API/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyViews } from "../../utils/fetchPropertyViews";

ModuleRegistry.registerModules([AllCommunityModule,MultiFilterModule,SetFilterModule ]);

const PropertyGrid = ({ groupedByBedroomsArray,selectedBedrooms,setSelectedPropertyForDetailHandler }) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { favorites,favoriteColor, toggleFavorite } = useFavorites();
    const [featured, setFeatured] = useState({});
    const dispatch = useDispatch();
    // Toggle featured
    const toggleFeatured = (propertyId) => {
        setFeatured((prev) => ({
            ...prev,
            [propertyId]: !prev[propertyId],
        }));
    };

    // Filter and clean the grouped array
    const cleanedGroupedByBedroomsArray = useMemo(() => {
        if (!Array.isArray(groupedByBedroomsArray)) return [];
        return groupedByBedroomsArray.filter(group => 
            Number(group.Bedrooms) !== 0 && group.properties.every(property => Number(property.Bedrooms) === Number(group.Bedrooms))
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
            .filter(group => !selectedBedrooms || Number(group.Bedrooms) === Number(selectedBedrooms)) // Filter by selectedBedrooms
            .flatMap(group => 
                group.properties.map(property => ({
                    Bedrooms: Number(group.Bedrooms),
                    PropertyBathrooms: Number(property.PropertyBathrooms) || Number(0),
                    SqFt: property.SqFt ? parseInt(property.SqFt.replace(/\D/g, ""), 10) || 0 : 0,
                    PropertyType: property.PropertyType,
                
                    PropertyMainEntranceFacing: property.PropertyMainEntranceFacing || "N/A",
                    Amount: property.Amount || "N/A",
                    fullPropertyData: property,
                }))
            );
    }, [cleanedGroupedByBedroomsArray, selectedBedrooms]); 


    const handlePropertyDetailsview = async (property) => {
        try {
            if (!property || !property.ProjectID) {
                toast.error("Invalid property data");
                return;
            }
            await fetchPropertyViews(dispatch, property.PropertyID, Id, bearerToken);
            setSelectedPropertyForDetailHandler(property); // Update selected property
        } catch (error) {
            console.error("Error fetching project views:", error);
            toast.error("Failed to fetch project views.");
        }
    };

    const handleToggleFavorite = async (property) => {
        console.log(property, "grid");
        
        const payload = { PropertyID: property.PropertyID };
    
        try {
            let response;
            const isFavorited = favorites.some(fav => fav.PropertyID === property.PropertyID);
    
            if (!isFavorited) {
                response = await fetchAddpropertyFavorties(bearerToken, payload);
            } else {
                response = await fetchDeletePropertyFavorties(bearerToken, { ...payload, UserID: Id });
            }
    
            const errorMessage = response?.processMessage?.includes("ERROR")
                ? response.processMessage.replace(/^ERROR:\s*/, "").trim()
                : "An error occurred, please try again.";
    
            if (response?.ProcessCode === 101 || response?.processMessage?.includes("ERROR")) {
                toast.error(errorMessage);
            } else {
                toggleFavorite(property);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.processMessage || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };
    
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
            valueFormatter: params => params.value ? `${params.value.toLocaleString()} SqFt` : "N/A", 
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
            headerName: "Actions",
            field: "fullPropertyData", // Use fullPropertyData
            flex: 0.6,
            cellStyle: { textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" },
            cellRenderer: params => {
                
                if (!params.value) return "N/A"; // Prevent undefined error
                const isFavorited = favorites.some(fav => fav.PropertyID === params.value.PropertyID);
                return (
                    <div style={{ display: "flex", gap: "10px" }}>
                        {/* Heart Icon for Favorite */}
                        <FaHeart
                            className="action-icon"
                            style={{ color: isFavorited ? favoriteColor : "#bbb", cursor: "pointer" }}
                            onClick={() => handleToggleFavorite(params.value)}
                        />
                        {/* Star Icon for Featured */}
                        <FaStar
                            className="action-icon"
                            style={{ color: featured[params.value.PropertyID] ? "gold" : "#bbb", cursor: "pointer" }}
                            onClick={() => toggleFeatured(params.value.PropertyID)}
                        />
                    </div>
                );
            },
            headerClass: "custom-header"
        }
        
    ], [favorites, featured]); 
    
 

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
