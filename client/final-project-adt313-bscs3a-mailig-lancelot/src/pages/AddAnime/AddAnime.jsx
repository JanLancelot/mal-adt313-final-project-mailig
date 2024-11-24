import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./AddAnime.css";

const TMDB_API_KEY = "2c7e4cf1a9c1270547b2397569f7ad40";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/tv";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const AnimeForm = ({ anime = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(anime.title || "");
  const [score, setScore] = useState(anime.score || "");
  const [synopsis, setSynopsis] = useState(anime.synopsis || "");
  const [coverPhoto, setCoverPhoto] = useState(anime.coverPhoto || "");
  const [popularity, setPopularity] = useState(anime.popularity || "");
  const [releaseDate, setReleaseDate] = useState(anime.releaseDate || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: anime.id || null,
      tmdb_id: anime.tmdb_id || null,
      title,
      score: parseFloat(score) || 0,
      synopsis,
      coverPhoto,
      popularity: parseFloat(popularity) || 0,
      releaseDate,
      genres: anime.genres || [],
    });
  };

  useEffect(() => {
    if (anime) {
      setTitle(anime.title || "");
      setScore(anime.score || "");
      setSynopsis(anime.synopsis || "");
      setCoverPhoto(anime.coverPhoto || "");
      setPopularity(anime.popularity || "");
      setReleaseDate(anime.releaseDate || "");
    }
  }, [anime]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="score">Score</label>
        <input
          id="score"
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="synopsis">Synopsis</label>
        <textarea
          id="synopsis"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="coverPhoto">Cover Photo URL</label>
        <input
          id="coverPhoto"
          type="url"
          value={coverPhoto}
          onChange={(e) => setCoverPhoto(e.target.value)}
          required
        />
        {coverPhoto && (
          <div className="cover-photo-preview">
            <img
              src={coverPhoto}
              alt="Cover Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="popularity">Popularity</label>
        <input id="popularity" type="number" value={popularity} readOnly />
      </div>
      <div>
        <label htmlFor="releaseDate">Release Date</label>
        <input id="releaseDate" type="date" value={releaseDate} readOnly />
      </div>
      <div>
        <label htmlFor="genres">Genres</label>
        <input
          id="genres"
          type="text"
          value={anime.genres ? anime.genres.join(", ") : ""}
          readOnly
        />
      </div>
      <div className="flex">
        <button type="submit" className="bg-blue">
          {anime.id ? "Update" : "Add"} Anime
        </button>
        <button type="button" onClick={onCancel} className="bg-gray">
          Cancel
        </button>
      </div>
    </form>
  );
};

AnimeForm.propTypes = {
  anime: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    synopsis: PropTypes.string,
    coverPhoto: PropTypes.string,
    popularity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    releaseDate: PropTypes.string,
    tmdb_id: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const AddAnime = ({ onAddAnime }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState({});
  const [extraDetails, setExtraDetails] = useState({
    cast: [],
    photos: [],
    videos: [],
  });
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(TMDB_SEARCH_URL, {
        params: {
          api_key: TMDB_API_KEY,
          query: searchQuery,
        },
      });
      setSearchResults(response.data.results);
    } catch (err) {
      setError(err.message || "Failed to search anime");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdditionalDetails = async (animeId) => {
    try {
      const [creditsResponse, imagesResponse, videosResponse, detailsResponse] =
        await Promise.all([
          axios.get(`${TMDB_BASE_URL}/tv/${animeId}/credits`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/tv/${animeId}/images`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/tv/${animeId}/videos`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/tv/${animeId}`, {
            params: { api_key: TMDB_API_KEY },
          }),
        ]);

      const genres = detailsResponse.data.genres.map((genre) => genre.name);

      setExtraDetails({
        cast: creditsResponse.data.cast.slice(0, 10),
        photos: imagesResponse.data.backdrops.slice(0, 10),
        videos: videosResponse.data.results.slice(0, 5),
      });

      setSelectedAnime((prev) => ({ ...prev, genres, tmdb_id: animeId }));
    } catch (err) {
      console.error("Failed to fetch additional details:", err);
    }
  };

  const handleSelectAnime = async (tmdbAnime) => {
    const animeData = {
      id: tmdbAnime.id,
      tmdb_id: tmdbAnime.id,
      title: tmdbAnime.name,
      score: tmdbAnime.vote_average,
      synopsis: tmdbAnime.overview,
      coverPhoto: `https://image.tmdb.org/t/p/w500${tmdbAnime.poster_path}`,
      popularity: tmdbAnime.popularity,
      releaseDate: tmdbAnime.first_air_date,
    };
    setSelectedAnime(animeData);
    await fetchAdditionalDetails(tmdbAnime.id);
  };

  const handleFormSubmit = (animeData) => {
    onAddAnime(animeData);
    navigate("/home");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Add Anime</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue">
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                {result.name} (
                {result.first_air_date
                  ? result.first_air_date.substring(0, 4)
                  : "N/A"}
                )
                <button
                  onClick={() => handleSelectAnime(result)}
                  className="bg-green"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimeForm
        anime={selectedAnime}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate("/home")}
      />

      {extraDetails.videos.length > 0 && (
        <div className="videos">
          <h3>Related Videos</h3>
          <div className="video-gallery">
            {extraDetails.videos.map((video) => (
              <iframe
                key={video.id}
                width="400"
                height="225"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ marginRight: "10px", marginBottom: "10px" }}
              ></iframe>
            ))}
          </div>
        </div>
      )}

      {extraDetails.photos.length > 0 && (
        <div className="photos">
          <h3>Related Photos</h3>
          <div
            className="photo-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              padding: "20px",
            }}
          >
            {extraDetails.photos.map((photo, index) => (
              <img
                key={index}
                src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
                alt={`Photo ${index + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {extraDetails.cast.length > 0 && (
        <div className="cast">
          <h3>Cast</h3>
          <div
            className="cast-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "20px",
              padding: "20px",
            }}
          >
            {extraDetails.cast.map((castMember) => (
              <div
                key={castMember.id}
                className="cast-member"
                style={{
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {castMember.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${castMember.profile_path}`}
                    alt={castMember.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                      marginBottom: "8px",
                    }}
                  />
                )}
                <div>
                  <strong>{castMember.name}</strong>
                  <div style={{ fontSize: "0.9em", color: "#666" }}>
                    {castMember.character}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AddAnime.propTypes = {
  onAddAnime: PropTypes.func.isRequired,
};

export default AddAnime;
