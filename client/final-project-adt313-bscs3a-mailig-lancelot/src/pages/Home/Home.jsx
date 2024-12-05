import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAnime } from "../../AnimeContext";
import "./Home.css";
import { useAuth } from "../../AuthContext";
import HeroSlider from "../HeroSlider/HeroSlider";

const AnimeCard = React.memo(({ anime, onUpdate, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  const handleViewDetails = useCallback(() => {
    navigate(`/anime/${anime.id}`);
  }, [navigate, anime.id]);

  const genresArray = useMemo(() => {
    return anime.genres ? JSON.parse(anime.genres) : [];
  }, [anime.genres]);

  const formattedReleaseDate = useMemo(() => {
    return anime.releaseDate
      ? new Date(anime.releaseDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  }, [anime.releaseDate]);

  return (
    <div className="anime-card">
      <div className="anime-card__image-wrapper">
        {anime.coverPhoto ? (
          <img
            src={anime.coverPhoto}
            alt={`${anime.title} Cover`}
            className="anime-card__image"
            loading="lazy"
          />
        ) : (
          <div className="anime-card__no-image">No Image Available</div>
        )}
        <div className="anime-card__score">
          <span className="anime-card__score-number">{anime.score}</span>
        </div>
      </div>
      <div className="anime-card__content">
        <h2 className="anime-card__title">{anime.title}</h2>
        <div className="anime-card__meta">
          <div className="anime-card__meta-item">
            <span className="anime-card__meta-label">Popularity:</span>
            <span className="anime-card__meta-value">
              {anime.popularity || "N/A"}
            </span>
          </div>
          <div className="anime-card__meta-item">
            <span className="anime-card__meta-label">Released:</span>
            <span className="anime-card__meta-value">
              {formattedReleaseDate}
            </span>
          </div>
        </div>
        <div className="anime-card__genres">
          {genresArray.map((genre, index) => (
            <span key={index} className="anime-card__genre-tag">
              {genre}
            </span>
          ))}
        </div>
        <p className="anime-card__synopsis">
          {anime.synopsis
            ? anime.synopsis.length > 150
              ? `${anime.synopsis.substring(0, 150)}...`
              : anime.synopsis
            : "No synopsis available."}
        </p>
        <div className="anime-card__actions">
          {isAdmin && (
            <>
              <button
                onClick={() => onUpdate(anime)}
                className="anime-card__button anime-card__button--update"
              >
                <span className="button-icon">✎</span>
                Update
              </button>
              <button
                onClick={() => onDelete(anime.id)}
                className="anime-card__button anime-card__button--delete"
              >
                <span className="button-icon">✖</span>
                Delete
              </button>
            </>
          )}
          <button
            onClick={handleViewDetails}
            className="anime-card__button anime-card__button--view"
          >
            <span className="button-icon">👁</span>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
});

AnimeCard.displayName = "AnimeCard";

AnimeCard.propTypes = {
  anime: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    synopsis: PropTypes.string,
    coverPhoto: PropTypes.string,
    popularity: PropTypes.number,
    releaseDate: PropTypes.string,
    genres: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const AnimeForm = ({ anime, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    id: anime ? anime.id : null,
    tmdb_id: anime ? anime.tmdb_id : "",
    title: anime ? anime.title : "",
    score: anime ? anime.score : "",
    synopsis: anime ? anime.synopsis : "",
    coverPhoto: anime ? anime.coverPhoto : "",
    popularity: anime ? anime.popularity : "",
    releaseDate: anime ? anime.releaseDate : "",
    genres: anime && anime.genres ? JSON.parse(anime.genres) : [],
  }));
  const [newGenre, setNewGenre] = useState("");

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const url = "http://localhost/mal-project/anime_operations.php";
      const method = anime ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            score: parseFloat(formData.score),
            popularity: parseFloat(formData.popularity),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          onSubmit(data);
        } else {
          console.error("Error:", data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the anime");
      }
    },
    [formData, onSubmit, anime]
  );

  const addGenre = useCallback(() => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre],
      }));
      setNewGenre("");
    }
  }, [newGenre, formData.genres]);

  const removeGenre = useCallback((genreToRemove) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  }, []);

  console.log(formData);

  return (
    <form onSubmit={handleSubmit} className="anime-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="score">Score</label>
        <input
          id="score"
          name="score"
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={formData.score}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="synopsis">Synopsis</label>
        <textarea
          id="synopsis"
          name="synopsis"
          value={formData.synopsis}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="coverPhoto">Cover Photo URL</label>
        <input
          id="coverPhoto"
          name="coverPhoto"
          type="url"
          value={formData.coverPhoto}
          onChange={handleInputChange}
          required
        />
        {formData.coverPhoto && (
          <div className="cover-preview">
            <img
              src={formData.coverPhoto}
              alt="Cover Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
              loading="lazy"
            />
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="popularity">Popularity</label>
        <input
          id="popularity"
          name="popularity"
          type="number"
          value={formData.popularity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="releaseDate">Release Date</label>
        <input
          id="releaseDate"
          name="releaseDate"
          type="date"
          value={formData.releaseDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="genres">Genres</label>
        <div className="genres-input-container">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add genre"
          />
          <button type="button" onClick={addGenre} className="add-genre-button">
            +
          </button>
        </div>
        <div className="genres-container">
          {formData.genres.map((genre, index) => (
            <div key={index} className="genre-item">
              {genre}
              <button
                type="button"
                onClick={() => removeGenre(genre)}
                className="remove-genre-button"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="bg-blue">
          {anime ? "Update" : "Add"} Anime
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
    tmdb_id: PropTypes.number,
    title: PropTypes.string,
    score: PropTypes.number,
    synopsis: PropTypes.string,
    coverPhoto: PropTypes.string,
    popularity: PropTypes.number,
    releaseDate: PropTypes.string,
    genres: PropTypes.any,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const Home = () => {
  const [editingAnime, setEditingAnime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScore, setFilterScore] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useMemo(() => user && user.role === "admin", [user]);
  const location = useLocation();
  const {
    animeList,
    animeCasts,
    animeCrews,
    animePhotos,
    animeVideos,
    loading,
    error,
    availableGenres,
    topAnime,
    deleteAnime,
    addAnime,
    fetchAnime,
  } = useAnime();

  useEffect(() => {
    if (user) {
      console.log("Test!");
      fetchAnime();
    }
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleUpdate = useCallback(
    (anime) => {
      navigate(`/update/${anime.id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id) => {
      console.log("Deleted Anime ID: ", id);

      if (window.confirm("Are you sure you want to delete this anime?")) {
        try {
          await deleteAnime(id);
        } catch (err) {
          console.error("Failed to delete anime", err);
        }
      }
    },
    [deleteAnime]
  );

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterScoreChange = useCallback((event) => {
    setFilterScore(event.target.value);
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  const handleFilterGenreChange = useCallback((event) => {
    setFilterGenre(event.target.value);
  }, []);

  const sortedAnimeList = useMemo(() => {
    let filteredAndSearchedAnimeList = animeList.filter((anime) => {
      const titleMatches = anime.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const scoreMatches =
        filterScore === "" ||
        parseFloat(anime.score) >= parseFloat(filterScore);

      let genreMatches = true;
      if (filterGenre) {
        try {
          const animeGenres = typeof anime.genres === 'string' ? JSON.parse(anime.genres) : [];
          genreMatches = animeGenres.includes(filterGenre);
        } catch (e) {
          console.error("Failed to parse genres for anime", anime, e);
          genreMatches = false;
        }
    }

      return titleMatches && scoreMatches && genreMatches;
    });
    if (sortBy === "popularity") {
      return [...filteredAndSearchedAnimeList].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
    } else if (sortBy === "score") {
      return [...filteredAndSearchedAnimeList].sort(
        (a, b) => b.score - a.score
      );
    }
    return filteredAndSearchedAnimeList;
  }, [animeList, searchQuery, filterScore, sortBy, filterGenre]);

  const handleAddNewAnime = useCallback(
    async (newAnime) => {
      try {
        await addAnime(newAnime);
        setEditingAnime(null);
      } catch (err) {
        console.error("Failed to add new anime", err);
      }
    },
    [addAnime]
  );

  const handleCancelAdd = useCallback(() => {
    setEditingAnime(null);
  }, []);

  const navToAddAnime = useCallback(() => {
    navigate("/add-anime");
  }, [navigate]);

  console.log("Anime Casts from Home:", animeCasts);
  console.log("Anime Crews from Home:", animeCrews);
  console.log("Anime Photos from Home:", animePhotos);
  console.log("Anime Videos from Home:", animeVideos);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return null;

  return (
    <div>
      <HeroSlider animes={topAnime} />
      <div className="container">
        <div className="content">
          <div className="page-header">
            <h2>Anime List</h2>
            {isAdmin && (
              <button onClick={navToAddAnime} className="add-anime-button">
                Add Anime
              </button>
            )}
          </div>

          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={filterScore}
              onChange={handleFilterScoreChange}
              className="filter-select"
            >
              <option value="">Filter by Score</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <option key={score} value={score}>
                  {score}+
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="">Sort By</option>
              <option value="popularity">Popularity</option>
              <option value="score">Score</option>
            </select>
            <select
              value={filterGenre}
              onChange={handleFilterGenreChange}
              className="filter-select"
            >
              <option value="">Filter by Genre</option>
              {availableGenres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {editingAnime && (
            <div className="edit-form-overlay">
              <div className="edit-form-container">
                <h2>{editingAnime.id ? "Edit Anime" : "Add New Anime"}</h2>
                <AnimeForm
                  anime={editingAnime}
                  onSubmit={editingAnime.id ? handleUpdate : handleAddNewAnime}
                  onCancel={handleCancelAdd}
                />
              </div>
            </div>
          )}

          <div className="anime-grid">
            {sortedAnimeList.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
