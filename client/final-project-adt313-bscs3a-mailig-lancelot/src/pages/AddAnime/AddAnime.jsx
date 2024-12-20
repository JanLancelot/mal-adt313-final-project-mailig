import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./AddAnime.css";
import { useAnime } from "../../AnimeContext";
import axios from "axios";

const TMDB_API_KEY = "2c7e4cf1a9c1270547b2397569f7ad40";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/tv";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function AnimeForm({ anime, onSubmit, onCancel }) {
  const [title, setTitle] = useState(anime.title || "");
  const [score, setScore] = useState(anime.score || "");
  const [synopsis, setSynopsis] = useState(anime.synopsis || "");
  const [coverPhoto, setCoverPhoto] = useState(anime.coverPhoto || "");
  const [popularity, setPopularity] = useState(anime.popularity || "");
  const [releaseDate, setReleaseDate] = useState(anime.releaseDate || "");
  const [genres, setGenres] = useState(anime.genres || []);
  const [cast, setCast] = useState(anime.cast || []);
  const [crew, setCrew] = useState(anime.crew || []);
  const [photos, setPhotos] = useState(anime.photos || []);
  const [videos, setVideos] = useState(anime.videos || []);
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(
    anime.number_of_episodes || ""
  );
  const [numberOfSeasons, setNumberOfSeasons] = useState(
    anime.number_of_seasons || ""
  );
  const [status, setStatus] = useState(anime.status || "");
  const [posterPath, setPosterPath] = useState(anime.posterPath || "");
  const { fetchAnime } = useAnime();

  function handleSubmit(e) {
    e.preventDefault();
    const formattedScore = parseFloat(parseFloat(score).toFixed(3)) || 0;
    const formattedPopularity = parseFloat(popularity) || 0;
    const formattedGenres = genres.split(",").map((genre) => genre.trim());

    onSubmit({
      id: anime.id,
      title,
      score: formattedScore,
      synopsis,
      coverPhoto,
      popularity: formattedPopularity,
      releaseDate,
      genres: formattedGenres,
      cast: JSON.stringify(cast),
      crew: JSON.stringify(crew),
      photos: JSON.stringify(photos),
      videos: JSON.stringify(videos),
      number_of_episodes: parseInt(numberOfEpisodes, 10) || 0,
      number_of_seasons: parseInt(numberOfSeasons, 10) || 0,
      status,
      posterPath,
    });
    fetchAnime();
  }

  useEffect(() => {
    if (anime) {
      setTitle(anime.title || "");
      setScore(anime.score || "");
      setSynopsis(anime.synopsis || "");
      setCoverPhoto(anime.coverPhoto || "");
      setPopularity(anime.popularity || "");
      setReleaseDate(anime.releaseDate || "");
     setGenres(Array.isArray(anime.genres) ? anime.genres.join(", ") : anime.genres || "");
      setCast(anime.cast || []);
      setCrew(anime.crew || []);
      setPhotos(anime.photos || []);
      setVideos(anime.videos || []);
      setNumberOfEpisodes(anime.number_of_episodes || "");
      setNumberOfSeasons(anime.number_of_seasons || "");
      setStatus(anime.status || "");
      setPosterPath(anime.posterPath || "");
    }
  }, [anime]);

  const handleRemoveItem = (array, setArray, index) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  const handlePhotoChange = (index, value) => {
    const newPhotos = [...photos];
    newPhotos[index] = value;
    setPhotos(newPhotos);
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...cast];
    newCast[index][field] = value;
    setCast(newCast);
  };

  const handleCrewChange = (index, field, value) => {
    const newCrew = [...crew];
    newCrew[index][field] = value;
    setCrew(newCrew);
  };

  const handlePosterSelect = (photo) => {
    setPosterPath(photo);
  };

  const handlePosterDeselect = () => {
    setPosterPath("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="anime-form">
        <div className="form-section main-info">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Enter anime title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="score">Score</label>
              <input
                id="score"
                type="number"
                step="0.001"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="popularity">Popularity</label>
              <input
                id="popularity"
                type="number"
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="synopsis">Synopsis</label>
            <textarea
              id="synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              required
              className="input-field textarea"
              placeholder="Enter anime synopsis"
              rows="4"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="genres">Genres</label>
              <input
                id="genres"
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numberOfEpisodes">Number of Episodes</label>
              <input
                id="numberOfEpisodes"
                type="number"
                value={numberOfEpisodes}
                onChange={(e) => setNumberOfEpisodes(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="numberOfSeasons">Number of Seasons</label>
              <input
                id="numberOfSeasons"
                type="number"
                value={numberOfSeasons}
                onChange={(e) => setNumberOfSeasons(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverPhoto">Cover Photo URL</label>
            <input
              id="coverPhoto"
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              required
              className="input-field"
              placeholder="Enter cover photo URL"
            />
            {coverPhoto && (
              <div className="cover-photo-preview">
                <img
                  src={coverPhoto}
                  alt="Cover Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Videos</h2>
          <div className="videos-grid">
            {videos.map((video, index) => (
              <div key={index} className="video-item">
                {video.key && (
                  <div className="video-frame">
                    <iframe
                      width="100%"
                      height="225"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name || video.key}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <div className="video-controls">
                  <input
                    type="text"
                    value={video.name || ""}
                    onChange={(e) =>
                      handleVideoChange(index, "name", e.target.value)
                    }
                    className="input-field"
                    placeholder="Video name"
                  />
                  <input
                    type="text"
                    value={video.key || ""}
                    onChange={(e) =>
                      handleVideoChange(index, "key", e.target.value)
                    }
                    className="input-field"
                    placeholder="YouTube ID"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(videos, setVideos, index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setVideos([...videos, { name: "", key: "" }])}
            className="add-button"
          >
            Add Video
          </button>
        </div>

        <div className="form-section">
          <h2>Photos</h2>
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img
                  src={photo}
                  alt={`Photo ${index}`}
                  className="photo-preview"
                  onClick={() => handlePosterSelect(photo)}
                  style={{
                    cursor: "pointer",
                    border: posterPath === photo ? "2px solid blue" : "none",
                  }}
                />
                <div className="photo-controls">
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => handlePhotoChange(index, e.target.value)}
                    className="input-field"
                    placeholder="Enter Photo URL"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(photos, setPhotos, index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="selected-poster-preview">
            <label>Selected Poster:</label>
            <div className="poster-preview-container">
              <img
                src={
                  posterPath ||
                  "https://placehold.co/300x169/ddd/666?text=Select+Poster&font=roboto"
                }
                alt="Selected Poster"
                className="poster-preview-image"
              />
              {posterPath && (
                <button
                  type="button"
                  onClick={handlePosterDeselect}
                  className="deselect-poster-button"
                >
                  Deselect
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPhotos([...photos, ""])}
            className="add-button"
          >
            Add Photo
          </button>
        </div>

        <div className="form-section">
          <h2>Cast & Crew</h2>
          <div className="cast-crew-container">
            <div className="cast-section">
              <h3>Cast</h3>
              <div className="cast-grid">
                {cast.map((castMember, index) => (
                  <div key={index} className="cast-crew-item">
                    <div className="profile-image-container">
                      {castMember.profile_path && (
                        <img
                          src={
                            castMember.profile_path.startsWith("http")
                              ? castMember.profile_path
                              : `https://image.tmdb.org/t/p/original${castMember.profile_path}`
                          }
                          alt={castMember.name}
                          className="profile-image"
                        />
                      )}
                    </div>
                    <div className="cast-crew-inputs">
                      <input
                        type="text"
                        value={castMember.name}
                        onChange={(e) =>
                          handleCastChange(index, "name", e.target.value)
                        }
                        className="input-field"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={castMember.character}
                        onChange={(e) =>
                          handleCastChange(index, "character", e.target.value)
                        }
                        className="input-field"
                        placeholder="Character"
                      />
                      <input
                        type="text"
                        value={castMember.profile_path || ""}
                        onChange={(e) =>
                          handleCastChange(
                            index,
                            "profile_path",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="Profile Image URL"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(cast, setCast, index)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCast([
                    ...cast,
                    { name: "", character: "", profile_path: "" },
                  ])
                }
                className="add-button"
              >
                Add Cast Member
              </button>
            </div>

            <div className="crew-section">
              <h3>Crew</h3>
              <div className="crew-grid">
                {crew.map((crewMember, index) => (
                  <div key={index} className="cast-crew-item">
                    <div className="profile-image-container">
                      {crewMember.profile_path && (
                        <img
                          src={
                            crewMember.profile_path.startsWith("http")
                              ? crewMember.profile_path
                              : `https://image.tmdb.org/t/p/original${crewMember.profile_path}`
                          }
                          alt={crewMember.name}
                          className="profile-image"
                        />
                      )}
                    </div>
                    <div className="cast-crew-inputs">
                      <input
                        type="text"
                        value={crewMember.name}
                        onChange={(e) =>
                          handleCrewChange(index, "name", e.target.value)
                        }
                        className="input-field"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={crewMember.job}
                        onChange={(e) =>
                          handleCrewChange(index, "job", e.target.value)
                        }
                        className="input-field"
                        placeholder="Job"
                      />
                      <input
                        type="text"
                        value={crewMember.profile_path || ""}
                        onChange={(e) =>
                          handleCrewChange(
                            index,
                            "profile_path",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="Profile Image URL"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(crew, setCrew, index)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCrew([...crew, { name: "", job: "", profile_path: "" }])
                }
                className="add-button"
              >
                Add Crew Member
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Add Anime
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

AnimeForm.propTypes = {
  anime: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default function AddAnime() {
  const { addAnime } = useAnime();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  async function handleSearch(pageNumber = 1) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(TMDB_SEARCH_URL, {
        params: {
          api_key: TMDB_API_KEY,
          query: searchQuery,
          page: pageNumber,
        },
      });
      setSearchResults(response.data.results);
      setTotalPages(response.data.total_pages);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message || "Failed to search anime");
      setSearchResults([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchAllCastAndCrew = async (animeId) => {
    let allCast = [];
    let allCrew = [];
    let page = 1;
    let totalPages = 1;
    do {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/tv/${animeId}/credits`,
          {
            params: { api_key: TMDB_API_KEY, page },
          }
        );
        allCast = allCast.concat(response.data.cast);
        allCrew = allCrew.concat(response.data.crew);
        totalPages = response.data.total_pages;
        page++;
      } catch (err) {
        console.error("Failed to fetch cast and crew:", err);
        break;
      }
    } while (page <= totalPages);

    return { cast: allCast, crew: allCrew };
  };

  async function fetchAdditionalDetails(animeId) {
      try {
          const [imagesResponse, videosResponse, detailsResponse, castAndCrew] =
            await Promise.all([
              axios.get(`${TMDB_BASE_URL}/tv/${animeId}/images`, {
                params: { api_key: TMDB_API_KEY },
              }),
              axios.get(`${TMDB_BASE_URL}/tv/${animeId}/videos`, {
                params: { api_key: TMDB_API_KEY },
              }),
              axios.get(`${TMDB_BASE_URL}/tv/${animeId}`, {
                params: { api_key: TMDB_API_KEY },
              }),
                fetchAllCastAndCrew(animeId),
            ]);

          const genres = detailsResponse.data.genres.map((genre) => genre.name);
  
            setSelectedAnime((prev) => ({
                ...prev,
                genres,
                tmdb_id: animeId,
                cast: castAndCrew.cast || [],
                crew: castAndCrew.crew || [],
                photos:
                    imagesResponse.data.backdrops
                    .map(
                        (photo) => `https://image.tmdb.org/t/p/original${photo.file_path}`
                    )
                    .slice(0, 10) || [],
                videos:
                    videosResponse.data.results.map((video) => video).slice(0, 5) || [],
                number_of_episodes: detailsResponse.data.number_of_episodes,
                number_of_seasons: detailsResponse.data.number_of_seasons,
                status: detailsResponse.data.status,
              }));
        } catch (err) {
          console.error("Failed to fetch additional details:", err);
        }
    }

  async function handleSelectAnime(tmdbAnime) {
    const animeData = {
      id: tmdbAnime.id,
      tmdb_id: tmdbAnime.id,
      title: tmdbAnime.name,
      score: tmdbAnime.vote_average,
      synopsis: tmdbAnime.overview,
      coverPhoto: `https://image.tmdb.org/t/p/original${tmdbAnime.poster_path}`,
      popularity: tmdbAnime.popularity,
      releaseDate: tmdbAnime.first_air_date,
    };
    setSelectedAnime(animeData);
    await fetchAdditionalDetails(tmdbAnime.id);
  }

  async function handleFormSubmit(animeData) {
    try {
      await addAnime(animeData);
      navigate("/home");
    } catch (error) {
      console.error("Error adding anime:", error);
    }
  }

  async function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="add-anime-container">
      <h1>Add Anime</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => handleSearch(1)} className="bg-blue">
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="search-results-grid">
            {searchResults.map((result) => (
              <div key={result.id} className="search-result-card">
                <div className="search-result-image">
                  <img
                    src={
                      result.poster_path
                        ? `https://image.tmdb.org/t/p/original${result.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Poster"
                    }
                    alt={result.name}
                  />
                </div>
                <div className="search-result-details">
                  <div className="search-result-content">
                    <h3>{result.name}</h3>
                    <p className="date">
                      {result.first_air_date ? result.first_air_date : "N/A"}
                    </p>
                    <p className="rating">Rating: {result.vote_average}</p>
                    <p className="overview">
                      {result.overview
                        ? `${result.overview.substring(0, 100)}...`
                        : "No overview available."}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectAnime(result)}
                    className="bg-green add-anime-shared-button"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="bg-blue"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="bg-blue"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AnimeForm
        anime={selectedAnime}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate("/home")}
      />
    </div>
  );
}