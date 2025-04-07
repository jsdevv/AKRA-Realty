import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash } from 'react-icons/fi';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import {
    clearSelectedProperty,
    fetchGetprojectFavorites,
    setSelectedAgentProperty,
    setSelectedProperty
} from '../../Redux/Slices/propertySlice';
import { fetchAddprojectshortlist, fetchDeleteProjectFavorties, fetchDeleteProjectshortlist } from '../../API/api';
import ListingModal from '../../components/ListingModal/ListingModal';
import Favoritescompare from '../../components/Favoritescompare/Favoritescompare';
import { useFavorites } from '../../context/FavoritesContext';
import defaultimg from "../../images/Apartment102.jpeg"
import defaultimg1 from "../../images/Apartment103.jpeg"
import Slider from 'react-slick/lib/slider';
import DashboardFavmap from '../Googlemap/DashboardFavmap/DashboardFavmap';
import "./DashboardProjectFav.css"

const DashboardProjectFav = ({ propertyfavtype }) => {
    const dispatch = useDispatch();
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { removeFavorite } = useFavorites();
    const { selectedProperty, Projectfavorites } = useSelector((state) => state.properties);

    const [selectedCompare, setSelectedCompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

 useEffect(() => {
        setSelectedCompare([]);
        dispatch(clearSelectedProperty());
        dispatch(setSelectedAgentProperty(null)); 
        if (bearerToken && Id && propertyfavtype === 'Project') {
            dispatch(fetchGetprojectFavorites(bearerToken));
        }
    }, [bearerToken, propertyfavtype, Id, dispatch]);


    const handleCompareSelect = (projectID) => {
        setSelectedCompare((prev) =>
            prev.includes(projectID) ? prev.filter((id) => id !== projectID) : [...prev, projectID]
        );
    };

    const handleLocationClick = (project) => {
        if (propertyfavtype === 'Project') {
            dispatch(setSelectedAgentProperty(project));
        }
      

    };

    const openComparisonModal = () => {
        if (selectedCompare.length < 2) {
            alert('Please select at least two projects to compare.');
            return;
        }
        setIsModalOpen(true);
    };

    const closeComparisonModal = () => {
        setIsModalOpen(false);
        // setSelectedCompare([]);
    };

    const handlePopupOpen = useCallback(
        (project) => dispatch(setSelectedProperty(project)),
        [dispatch]
    );

    const handleCloseModal = useCallback(() => dispatch(clearSelectedProperty()), [dispatch]);

    const handleRemoveFavorite = async (project) => {
        removeFavorite(project.ProjectID);
        const payload = { ProjectID: project.ProjectID, UserID: Id };

        try {
            await fetchDeleteProjectFavorties(bearerToken, payload);
            dispatch(fetchGetprojectFavorites(bearerToken));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

        const toggleShortlist = async (project) => {
            const isShortlisted = project.ShortlistStatus === "Y";
            const payload = { ProjectID: project.ProjectID };
        
            try {
                const response = isShortlisted
                    ? await fetchDeleteProjectshortlist(bearerToken, { ...payload, UserID: Id })
                    : await fetchAddprojectshortlist(bearerToken, { ...payload, UserID: Id });
        
                console.log('Shortlist Toggle Response:', response);
        
                dispatch(fetchGetprojectFavorites(bearerToken));
    
            } catch (error) {
                console.error('Error toggling shortlist:', error);
            }
        };
        

    return (
        <div className="favoritesproject-container">
            <div className='projectfav-box'>
                <div className='projectfavleft-section'>
                    {Projectfavorites?.length === 0 ? (
                        <p className="dashboard-favorites-empty ">You haven't saved any project favorites yet.</p>
                    ) : (
                        <table className="dashboard-favorites-table ">
                            <thead>
                                <tr>
                                    <th>Projects</th>
                                    <th>Project Name</th>
                                    <th>Price Range</th>
                                    <th>Location</th>
                                    <th>Details</th>
                                    <th>Shortlist</th>
                                    <th>Compare</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Projectfavorites.map((project) => {
                                   const imageUrls = [
                                    ...(project.ProjectImageUrls ? project.ProjectImageUrls.split(',').map(url => url.trim()) : []),
                                    ...(project.PropertyImageUrls ? project.PropertyImageUrls.split(',').map(url => url.trim()) : [])
                                  
                                  ].filter(url => url);
                                  


                                    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg, defaultimg1];
                                    const settings = {
                                        // dots: true,
                                        infinite: true,
                                        speed: 500,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: false,
                                    };
                                    return (
                                        <tr key={project.ProjectID}>
                                            <td>

                                                <Slider {...settings} className="dashboardslider">
                                                    {imagesToShow.map((url, index) => (
                                                        <div key={index}

                                                            onClick={() => handlePopupOpen(project)} >
                                                            <img
                                                                src={url}
                                                                alt={`Slide ${index + 1}`}
                                                                className="favproperty-table__image"
                                                                loading="lazy"
                                            
                                                            />
                                                        </div>
                                                    ))}

                                                </Slider>
                                            </td>
                                            <td>{project.PropertyName}</td>
                                            <td>₹ {project.MinPrice} - ₹ {project.MaxPrice}</td>
                                            <td>{project.Locality}</td>
                                            <td>
                                                <button className="dashboard-details-button" onClick={() => handlePopupOpen(project)}>Details</button>
                                            </td>
                                            <td>
                                                <button className={`dashboard-shortlist-button  ${project.ShortlistStatus === "Y" ? 'shortlisted' : ''}`} onClick={() => toggleShortlist(project)}>
                                                    <FaStar className={`dashboard-shortlist-icon   ${project.ShortlistStatus === "Y" ? 'highlighted' : ''}`} />
                                                </button>
                                            </td>
                                            <td>
                                                <input className='dashboard-compare' type="checkbox" checked={selectedCompare.includes(project.ProjectID)} onChange={() => handleCompareSelect(project.ProjectID)} />
                                            </td>
                                            <td>
                                                <button className="dashboard-remove-button" onClick={() => handleLocationClick(project)}>
                                                    <FaMapMarkerAlt />
                                                </button>
                                                <button className="dashboard-remove-button" onClick={() => handleRemoveFavorite(project)}>
                                                    <FiTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className='projectfavright-section'>
                    <DashboardFavmap favData = {Projectfavorites} propertyType="Project" />
                </div>

            </div>

            {selectedCompare.length >= 2 && (
    <div className="dashboard-favcompare-button-container">
        {selectedCompare.length >= 11 ? (
            <p className="error-message">You can compare a maximum of 10 projects only.</p>
        ) : (
            selectedCompare.length <= 11 && <p>{selectedCompare.length} Projects selected for comparison</p>
        )}

        {selectedCompare.length <= 10 && (
            <button className="dashboard-favcompare-button" onClick={openComparisonModal}>
                Compare
            </button>
        )}
    </div>
)}


            {isModalOpen && (
                <Favoritescompare properties={Projectfavorites.filter((project) => selectedCompare.includes(project.ProjectID))} onClose={closeComparisonModal} />
            )}

            {selectedProperty && (
                <ListingModal propertyType="Project" selectedProperty={selectedProperty} onClose={handleCloseModal} bearerToken={bearerToken} />
            )}
        </div>
    );
};

export default DashboardProjectFav;
