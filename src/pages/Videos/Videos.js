import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../../Redux/Slices/videosSlice';
import YouTube from 'react-youtube';
import { MdFilterList } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';
import VideoSlider from '../../components/VideoSlider/VideoSlider';
import './Videos.css';
import { fetchPremiumListingsThunk, fetchProperties, setCurrentPage, setFilteredVideos, setPriceFilter, setSearchTerm, setSelectedcustomStatus, setSelectedHomeTypes, setSelectedPropertyStatus } from '../../Redux/Slices/propertySlice';

const Videos = () => {
  const dispatch = useDispatch();
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [projects, setProjects] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPropertyVideo, setSelectedPropertyVideo] = useState(null);


  const {
    videos,
    visibleVideos,
    filteredVideos,
    properties,
    premiumListings,
    loading,
    error,
    searchTerm,
    selectedPropertyStatus,
    selectedcustomStatus,
    selectedHomeTypes,
    priceFilter,
    showPremiumListings,
  } = useSelector((state) => state.properties);


  console.log(visibleVideos, "visibleVideos");

  useEffect(() => {
    if (bearerToken && !loading && properties.length === 0) {
      dispatch(fetchProperties(bearerToken));
    }
  }, [bearerToken, loading, properties.length, dispatch]);

  useEffect(() => {
    if (bearerToken && !loading && videos.length === 0) {
      dispatch(fetchVideos(bearerToken));
    }
  }, [bearerToken, loading, videos.length, dispatch]);


  useEffect(() => {
    if (bearerToken && showPremiumListings && !premiumListings.length) {
      dispatch(fetchPremiumListingsThunk(bearerToken));
    }
  }, [bearerToken, dispatch, showPremiumListings, premiumListings.length]);

  useEffect(() => {
    dispatch(setFilteredVideos());
    setIsFiltering(false);
  }, [
    searchTerm,
    selectedPropertyStatus,
    selectedcustomStatus,
    selectedHomeTypes,
    priceFilter,
    showPremiumListings,
    dispatch]);

  useEffect(() => {
    if (visibleVideos && visibleVideos.length) {
      processVideoData(visibleVideos);
    }
  }, [visibleVideos]);


  const processVideoData = (data) => {
    if (data && Array.isArray(data)) {
      const projectMap = new Map();
      const propertyList = [];
  
      data.forEach((property) => {
        const {
          ProjectName,
          ProjectVideoUrls,
          PropertyVideoUrls,
          PropertyCardLine3,
          PropertyName,
          PriceRange,
          SqFtRange,
          Amount,
          PropertyID,
          ProjectID,
        } = property;
  
        const projectKey = ProjectName || PropertyName;
  
        if (ProjectName && ProjectVideoUrls) {
          const projectMapKey = `${ProjectID}-${ProjectName}`;
  
          if (!projectMap.has(projectMapKey)) {
            projectMap.set(projectMapKey, {
              id: `${ProjectID}-${ProjectVideoUrls}`, // unique key
              videoId: ProjectVideoUrls,              // actual YouTube video ID
              name: projectKey,
              PropertyCardLine3,
              properties: [],
              PriceRange: PriceRange || Amount,
              SqFtRange,
            });
          }
  
          if (PropertyVideoUrls) {
            projectMap.get(projectMapKey).properties.push({
              id: `${PropertyID}-${PropertyVideoUrls}`, // unique key
              videoId: PropertyVideoUrls,               // actual YouTube video ID
              title: PropertyName,
            });
          }
        } else if (PropertyVideoUrls) {
          propertyList.push({
            id: `${PropertyID}-${PropertyVideoUrls}`, // unique key
            videoId: PropertyVideoUrls,               // actual YouTube video ID
            title: PropertyName,
            PriceRange: PriceRange || Amount,
            SqFtRange,
            PropertyCardLine3,
          });
        }
      });
  
      const finalProjects = Array.from(projectMap.values());
  
      const allProperties = [
        ...finalProjects,
        ...propertyList.map((property) => ({
          id: property.id,
          videoId: property.videoId,
          name: property.title,
          description: '',
          properties: [],
          PriceRange: property.PriceRange,
          SqFtRange: property.SqFtRange,
          PropertyCardLine3: property.PropertyCardLine3,
        })),
      ];
  
      setProjects(allProperties);
      setSelectedProject(finalProjects[0] || (propertyList.length > 0 ? { properties: propertyList } : null));
      setSelectedPropertyVideo(null);
    }
  };
  

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedPropertyVideo(null);
  };

  const handlePropertyClick = (property) => {
    setSelectedPropertyVideo(property);
  };

  return (
    <>
      <div className="videos-layout">
        <div className="video-list-container">
          <div className="video-list-header">
            <h3>Project & Property Videos</h3>
            <MdFilterList className="videofilter-icon" />
          </div>

          {isFiltering ? (
            <p>Loading videos...</p>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : projects.length === 0 ? (
            <p>No videos available</p>
          ) : (
            <div className="video-list">
              {projects.map((project) => (
                <div key={project.id || project.name} className="project-section">
                  {project.id && project.name && (
                    <div
                      className={`video-card ${selectedProject?.id === project.id ? 'active' : ''}`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${project.videoId}/hqdefault.jpg`}
                        alt={project.name}
                        className="video-thumbnail"
                        loading="lazy"
                      />
                      <div className="video-info">
                        <div className="video-title-price">
                          <h3 className="video-title">{project.name}</h3>
                          {project.PriceRange && (
                            <p className="video-price">
                              <FaRupeeSign size={10} /> {project.PriceRange}
                            </p>
                          )}
                        </div>

                        {project.SqFtRange && <p className="video-area">{project.SqFtRange}</p>}

                        <div className="video-title-price1">
                          {project.PropertyCardLine3 && <p className="video-area">{project.PropertyCardLine3}</p>}
                          {project.properties.length > 0 && <p className="video-count">{`${project.properties.length} Units`}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="video-display">
          {selectedProject && (
            <div className="video-container">
              <YouTube
                videoId={selectedPropertyVideo ? selectedPropertyVideo.videoId : selectedProject.videoId}
                className="youtube-iframe"
                opts={{ width: '100%', height: '100%' }}
              />
              <h3 className="video-title">{selectedPropertyVideo ? selectedPropertyVideo.title : selectedProject.name}</h3>
            </div>
          )}

          {selectedProject?.properties?.length > 0 ? (
            <div className="property-playlist">
              <VideoSlider properties={selectedProject.properties} selectedPropertyVideo={selectedPropertyVideo} onPropertyClick={handlePropertyClick} />
            </div>
          ) : (
            <div className="project-info">
              <p>No Property Videos available.</p>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default Videos;
