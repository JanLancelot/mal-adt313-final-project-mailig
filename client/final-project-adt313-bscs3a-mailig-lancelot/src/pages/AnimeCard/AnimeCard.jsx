import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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

export default AnimeCard;