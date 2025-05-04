import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../../Redux/Slices/videosSlice';
import YouTube from 'react-youtube';
import { MdFilterList } from 'react-icons/md';
import { FaRupeeSign } from 'react-icons/fa';
import VideoSlider from '../../components/VideoSlider/VideoSlider';
import './Videos.css';
import { fetchPremiumListingsThunk, fetchProperties, setFilteredVideos } from '../../Redux/Slices/propertySlice';

const Videos = () => {
  const dispatch = useDispatch();
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPropertyVideo, setSelectedPropertyVideo] = useState(null);

  const {
    videos,
    visibleVideos,
    properties,
    premiumListings,
    loading,
    searchTerm,
    selectedPropertyStatus,
    selectedcustomStatus,
    selectedHomeTypes,
    priceFilter,
    showPremiumListings,
  } = useSelector((state) => state.properties);

  const hasFetchedProperties = useRef(false);

  useEffect(() => {
    if (bearerToken && !hasFetchedProperties.current && properties.length === 0) {
      hasFetchedProperties.current = true;
      dispatch(fetchProperties(bearerToken));
    }
  }, [bearerToken, properties.length, dispatch]);

  const hasFetchedVideos = useRef(false);
  useEffect(() => {
    if (bearerToken && !hasFetchedVideos.current && videos.length === 0) {
      hasFetchedVideos.current = true;
      dispatch(fetchVideos(bearerToken));
    }
  }, [bearerToken, videos.length, dispatch]);

  const hasFetchedPremium = useRef(false);
  useEffect(() => {
    if (bearerToken && showPremiumListings && !hasFetchedPremium.current && premiumListings.length === 0) {
      hasFetchedPremium.current = true;
      dispatch(fetchPremiumListingsThunk(bearerToken));
    }
  }, [bearerToken, showPremiumListings, premiumListings.length, dispatch]);


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

  const projects = useMemo(() => {
    if (!visibleVideos || !Array.isArray(visibleVideos)) return [];

    const projectMap = new Map();
    const propertyList = [];

    visibleVideos.forEach((property) => {
      const {
        ProjectName,
        ProjectVideoUrls,
        PropertyVideoUrls,
        PropertyCardLine3,
        Locality,
        PropertyZipCode,
        PropertyState,
        PropertyType,
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
            id: `${ProjectID}-${ProjectVideoUrls}`,
            videoId: ProjectVideoUrls,
            name: projectKey,
            PropertyCardLine3,
            Locality,
            PropertyZipCode,
            PropertyState,
            PropertyType,
            properties: [],
            PriceRange: PriceRange || Amount,
            SqFtRange,
          });
        }

        if (PropertyVideoUrls) {
          projectMap.get(projectMapKey).properties.push({
            id: `${PropertyID}-${PropertyVideoUrls}`,
            videoId: PropertyVideoUrls,
            title: PropertyName,
          });
        }
      } else if (PropertyVideoUrls) {
        propertyList.push({
          id: `${PropertyID}-${PropertyVideoUrls}`,
          videoId: PropertyVideoUrls,
          title: PropertyName,
          PriceRange: PriceRange || Amount,
          SqFtRange,
          PropertyCardLine3,
          Locality,
          PropertyZipCode,
          PropertyState,
          PropertyType
        });
      }
    });

    const finalProjects = Array.from(projectMap.values());

    return [
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
        PropertyType: property.PropertyType,
        Locality: property.Locality,
        PropertyZipCode: property.PropertyZipCode,
        PropertyState: property.PropertyState,
      })),
    ];
  }, [visibleVideos]);

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedPropertyVideo(null);
  };

  const handlePropertyClick = (property) => {
    setSelectedPropertyVideo(property);
  };

  return (
    <div className="videos-layout">
      <div className="video-list-container">
        <div className="video-list-header">
          <h3>Project & Property Videos</h3>
          <h3>{projects.length} Videos available</h3>
        </div>

        {loading ? (
          <p>Videos are loading...</p>
        ) : projects.length === 0 ? (
          <p>No videos found based on your filters.</p>
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
                          <span className="video-price">
                            <FaRupeeSign size={10} /> {project.PriceRange}
                          </span>
                        )}
                      </div>

                      <div className="video-area">
                        {((project.PropertyType || project.SqFtRange) && (
                          <>
                            {project.PropertyType}
                            {project.PropertyType && project.SqFtRange && " | "}
                            {project.SqFtRange} <br />
                          </>
                        ))}

                        {((project.Locality || project.PropertyState || project.PropertyZipCode) && (
                          <>
                            {project.Locality && `${project.Locality} | `}
                            {project.PropertyState && `${project.PropertyState} | `}
                            {project.PropertyZipCode && project.PropertyZipCode}
                          </>
                        ))}

                        {project.properties.length > 0 && (
                          <p className="video-count">{`${project.properties.length} Units`}</p>
                        )}
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
      <div className='video-displayheader' >
  <h3 className="video-title1">
    {selectedPropertyVideo ? selectedPropertyVideo.title : selectedProject?.name || 'No title available'}
  </h3>
  {projects.length !== 0 && (
    (selectedProject?.Locality || selectedProject?.PropertyState || selectedProject?.PropertyZipCode) && (
      <p>
        {selectedProject?.Locality && `${selectedProject.Locality} | `}
        {selectedProject?.PropertyState && `${selectedProject.PropertyState} | `}
        {selectedProject?.PropertyZipCode}
      </p>
    )
  )}
</div>

        {selectedProject && (
          <div className="video-container">

            <YouTube
              videoId={selectedPropertyVideo ? selectedPropertyVideo.videoId : selectedProject.videoId}
              className="youtube-iframe"
              opts={{ width: '100%', height: '100%' }}
            />

          </div>
        )}

        {selectedProject?.properties?.length > 0 ? (
          <div className="property-playlist">
            <VideoSlider properties={selectedProject.properties} selectedPropertyVideo={selectedPropertyVideo} onPropertyClick={handlePropertyClick} />
          </div>
        ) : (
          <div className="project-info">
            {/* <p>Property videos are currently unavailable.</p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
