import React, { useMemo } from "react";
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

ModuleRegistry.registerModules([AllCommunityModule,MultiFilterModule,SetFilterModule ]);

const PropertyGrid = ({ groupedByBedroomsArray,selectedBedrooms,setSelectedPropertyForDetailHandler }) => {

    // Filter and clean the grouped array
    const cleanedGroupedByBedroomsArray = useMemo(() => {
        if (!Array.isArray(groupedByBedroomsArray)) return [];
        return groupedByBedroomsArray.filter(group => 
            Number(group.Bedrooms) !== 0 && group.properties.every(property => Number(property.Bedrooms) === Number(group.Bedrooms))
        );
    }, [groupedByBedroomsArray]);

    console.log(cleanedGroupedByBedroomsArray, "cleanedGroupedByBedroomsArray");



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
    }, [cleanedGroupedByBedroomsArray, selectedBedrooms]); // Depend on selectedBedrooms
    
    
    
    const columnDefs = useMemo(() => [
        { 
            headerName: "Type", 
            field: "PropertyType", 
            flex: 0.8,  
            headerClass: "custom-header",
            filter: "agSetColumnFilter", 
        },
        { 
            headerName: "Amount", 
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
                    onClick={() => setSelectedPropertyForDetailHandler(params.value)}
                >
                    Details
                </p>
            ),
            headerClass: "custom-header"
        }
    ], []);
    
    console.log(flatData, "flatData");

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
