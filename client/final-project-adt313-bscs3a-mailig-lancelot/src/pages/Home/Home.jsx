import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAnime } from "../../AnimeContext";
import "./Home.css";
import { useAuth } from "../../AuthContext";
import HeroSlider from "../HeroSlider/HeroSlider";

const AnimeCard = ({ anime, onUpdate, onDelete, isAdmin }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/anime/${anime.id}`);
    };

    const genresArray = anime.genres ? JSON.parse(anime.genres) : [];

    return (
        <div className="anime-card">
            <div className="anime-card__image-wrapper">
                {anime.coverPhoto ? (
                    <img
                        src={anime.coverPhoto}
                        alt={`${anime.title} Cover`}
                        className="anime-card__image"
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
                        <span className="anime-card__meta-value">{anime.popularity || 'N/A'}</span>
                    </div>
                    <div className="anime-card__meta-item">
                        <span className="anime-card__meta-label">Released:</span>
                        <span className="anime-card__meta-value">
                            {anime.releaseDate
                                ? new Date(anime.releaseDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                                : 'N/A'}
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
};

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
  const [formData, setFormData] = useState({
    id: anime ? anime.id : null,
    tmdb_id: anime ? anime.tmdb_id : "",
    title: anime ? anime.title : "",
    score: anime ? anime.score : "",
    synopsis: anime ? anime.synopsis : "",
    coverPhoto: anime ? anime.coverPhoto : "",
    popularity: anime ? anime.popularity : "",
    releaseDate: anime ? anime.releaseDate : "",
    genres: (() => {
      try {
        return anime && anime.genres ? JSON.parse(anime.genres) : [];
      } catch (error) {
        console.error("Error parsing genres:", error);
        return [];
      }
    })(),
  });
  const [newGenre, setNewGenre] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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
  };

  const addGenre = () => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre],
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

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
  const isAdmin = user && user.role === "admin";
  const location = useLocation();
  const {
    animeList,
    loading,
    error,
    availableGenres,
    topAnime,
    updateAnime,
    deleteAnime,
    addAnime,
    fetchAnime,
  } = useAnime();

  console.log(user.role);

  useEffect(() => {
    if (user) {
      fetchAnime();
    }
  }, [user, location.pathname, fetchAnime]);

  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleUpdate = async (updatedAnime) => {
    try {
      await updateAnime(updatedAnime);
      setEditingAnime(null);
    } catch (err) {
      console.error("Failed to update anime", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this anime?")) {
      try {
        await deleteAnime(id);
      } catch (err) {
        console.error("Failed to delete anime", err);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterScoreChange = (event) => {
    setFilterScore(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterGenreChange = (event) => {
    setFilterGenre(event.target.value);
  };

  const sortAnimeList = (list) => {
    if (sortBy === "popularity") {
      return [...list].sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      );
    } else if (sortBy === "score") {
      return [...list].sort((a, b) => b.score - a.score);
    }
    return list;
  };

  const filteredAndSearchedAnimeList = animeList.filter((anime) => {
    const titleMatches = anime.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const scoreMatches =
      filterScore === "" || parseFloat(anime.score) >= parseFloat(filterScore);

    let genreMatches = true;
    if (filterGenre) {
      try {
        const animeGenres = anime.genres ? JSON.parse(anime.genres) : [];
        genreMatches = animeGenres.includes(filterGenre);
      } catch (e) {
        console.error("Failed to parse genres for anime", anime, e);
        genreMatches = false;
      }
    }

    return titleMatches && scoreMatches && genreMatches;
  });

  const sortedAnimeList = sortAnimeList(filteredAndSearchedAnimeList);

  const handleAddNewAnime = async (newAnime) => {
    try {
      await addAnime(newAnime);
      navigate("/home");
    } catch (err) {
      console.error("Failed to add new anime", err);
    }
  };

  const handleCancelAdd = () => {
    setEditingAnime(null);
  };

  function navToAddAnime() {
    navigate("/add-anime");
  }

  return (
    <div className="container">
      <HeroSlider animes={topAnime} />
      <div className="content">
        <div className="page-header">
          <h2>Anime List</h2>
          {isAdmin && (
            <button
              onClick={() => navToAddAnime()}
              className="add-anime-button"
            >
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
              onUpdate={() => setEditingAnime(anime)}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
