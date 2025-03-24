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
import { fetchDeleteProjectFavorties } from '../../API/api';
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
    const { favorites, removeFavorite, toggleShortlist } = useFavorites();
    const { selectedProperty, Projectfavorites } = useSelector((state) => state.properties);

    const [selectedCompare, setSelectedCompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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
        // Close both modals if they are open

        dispatch(setSelectedAgentProperty(project));

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
        setSelectedCompare([]);
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
                                    const imageUrls = project.PropertyImageUrls
                                        ? project.PropertyImageUrls.split(',').map(url => url.trim())
                                        : project.ProjectImageUrls
                                            ? project.ProjectImageUrls.split(',').map(url => url.trim())
                                            : [];


                                    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg, defaultimg1];
                                    const settings = {
                                        // dots: true,
                                        infinite: true,
                                        speed: 500,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: true,
                                    };
                                    return (
                                        <tr key={project.ProjectID}>
                                            <td>

                                                <Slider {...settings}>
                                                    {imagesToShow.map((url, index) => (
                                                        <div key={index}

                                                            onClick={() => handlePopupOpen(project)} >
                                                            <img
                                                                src={url}
                                                                alt={`Slide ${index + 1}`}
                                                                className="favproperty-table__image"
                                                                loading="lazy"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "200px",
                                                                    objectFit: "cover",
                                                                }}
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
                                                <button className={`dashboard-shortlist-button  ${project.shortlisted ? 'shortlisted' : ''}`} onClick={() => toggleShortlist(project.ProjectID)}>
                                                    <FaStar className={`dashboard-shortlist-button  ${project.shortlisted ? 'highlighted' : ''}`} />
                                                </button>
                                            </td>
                                            <td>
                                                <input type="checkbox" checked={selectedCompare.includes(project.ProjectID)} onChange={() => handleCompareSelect(project.ProjectID)} />
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
                    <p>{selectedCompare.length} projects selected for comparison</p>
                    <button   className="dashboard-favcompare-button" onClick={openComparisonModal}>Compare</button>
                </div>
            )}

            {isModalOpen && (
                <Favoritescompare properties={favorites.filter((project) => selectedCompare.includes(project.ProjectID))} onClose={closeComparisonModal} />
            )}

            {selectedProperty && (
                <ListingModal propertyType="Project" selectedProperty={selectedProperty} onClose={handleCloseModal} bearerToken={bearerToken} />
            )}
        </div>
    );
};

export default DashboardProjectFav;
