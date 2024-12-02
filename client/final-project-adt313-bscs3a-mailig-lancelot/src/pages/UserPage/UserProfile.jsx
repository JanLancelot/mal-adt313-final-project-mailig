import React, { useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../../AnimeContext';
import PropTypes from "prop-types";
import './UserProfile.css';

export default function UserProfile() {
    const { user, favorites, reviews, loadingReviews, fetchReviews } = useAuth();
    const { animeList } = useAnime();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loadingReviews && reviews.length === 0) {
            fetchReviews(user.id);
        }
    }, [user, loadingReviews, reviews.length, fetchReviews]);

    const favoriteAnimeDetails = useMemo(() => {
        return favorites.map(animeId => animeList.find(anime => anime.id === animeId)).filter(Boolean);
    }, [favorites, animeList]);

    const handleAnimeClick = useCallback((animeId) => {
        navigate(`/anime/${animeId}`);
    }, [navigate]);

    if (!user) return <p>You must be logged in to view this page.</p>;
    if (loadingReviews) return <div>Loading...</div>;

    return (
        <div className="user-page-container">
            <h1>{user.username} Profile</h1>
            <h2>Favorites</h2>
            <div className="favorites-list">
                {favoriteAnimeDetails.length === 0 ? (
                    <p>No favorites added yet.</p>
                ) : (
                    <div className="anime-grid">
                        {favoriteAnimeDetails.map((anime) => (
                            <AnimeCard key={anime.id} anime={anime} />
                        ))}
                    </div>
                )}
            </div>
            <h2>Reviews</h2>
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.animeId} className="review-item">
                            <p className="review-anime-title" onClick={() => handleAnimeClick(review.animeId)}>
                                {review.title}
                            </p>
                            <p>{review.reviewText}</p>
                            <p className="review-date">{new Date(review.reviewDate).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


const AnimeCard = React.memo(({ anime }) => {
    const navigate = useNavigate();

    const handleViewDetails = useCallback(() => {
        navigate(`/anime/${anime.id}`);
    }, [navigate, anime.id]);

    const genresArray = useMemo(() => {
      return anime.genres ? JSON.parse(anime.genres) : [];
    }, [anime.genres]);
      
    const formattedReleaseDate =  useMemo(() => {
      return anime.releaseDate
      ? new Date(anime.releaseDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'N/A';
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
                        <span className="anime-card__meta-value">{anime.popularity || 'N/A'}</span>
                    </div>
                    <div className="anime-card__meta-item">
                        <span className="anime-card__meta-label">Released:</span>
                        <span className="anime-card__meta-value">{formattedReleaseDate}</span>
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

AnimeCard.displayName = 'AnimeCard';

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