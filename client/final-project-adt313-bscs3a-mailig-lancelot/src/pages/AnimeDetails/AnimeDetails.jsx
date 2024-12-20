import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AnimeDetails.css";
import { useAnime } from "../../AnimeContext";
import { useAuth } from "../../AuthContext";
import { FaStar as SolidStar } from "react-icons/fa";
import { FaRegStar as RegularStar } from "react-icons/fa";
import { AiFillStar as FilledStar } from "react-icons/ai";
import { AiOutlineStar as OutlineStar } from "react-icons/ai";

function getInitials(name) {
  if (!name) return "";
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0);
  }
  return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

const API_BASE_URL = "http://localhost/mal-project";

export default function AnimeDetails() {
  const { animeId } = useParams();
  const [localAnimeDetails, setLocalAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { animeList, animeCasts, animeCrews, animePhotos, animeVideos } =
    useAnime();
  const {
    user,
    favorites,
    loadingFavorites,
    updateFavorites,
    ratings,
    loadingRatings,
    fetchRatingForAnime,
    updateRating,
    addOrUpdateReview,
    token,
  } = useAuth();

  const [animeReviews, setAnimeReviews] = useState([]);
  const [loadingAnimeReviews, setLoadingAnimeReviews] = useState(false);

  const isFavorite = useMemo(
    () => favorites && favorites.includes(parseInt(animeId)),
    [favorites, animeId]
  );

  const userRating = useMemo(() => {
    return ratings[animeId];
  }, [ratings, animeId]);

  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const genres = useMemo(() => {
    try {
      return localAnimeDetails && localAnimeDetails.genres
        ? JSON.parse(localAnimeDetails.genres)
        : [];
    } catch (e) {
      console.error("Error parsing genres:", e);
      return [];
    }
  }, [localAnimeDetails]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      setError(null);

      const foundAnime = animeList.find(
        (anime) => anime.id === parseInt(animeId)
      );

      if (foundAnime) {
        setLocalAnimeDetails(foundAnime);
      } else {
        setError("Anime not found in the list.");
      }

      setLoading(false);
    };

    fetchAnimeDetails();
  }, [animeId, animeList]);

  const fetchReviewsForAnime = useCallback(
    async (animeId) => {
      setLoadingAnimeReviews(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/anime_reviews_operations.php?animeId=${animeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.reviews) {
          setAnimeReviews(data.reviews);
        } else {
          setAnimeReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews for anime:", error);
        setAnimeReviews([]);
      } finally {
        setLoadingAnimeReviews(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (user && animeId) {
      fetchRatingForAnime(user.id, animeId);
      fetchReviewsForAnime(animeId);
    }
  }, [user, animeId, fetchRatingForAnime, fetchReviewsForAnime]);

  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await updateFavorites(
      user.id,
      parseInt(animeId),
      isFavorite ? "remove" : "add"
    );
  }, [user, animeId, isFavorite, updateFavorites, navigate]);

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingClick = useCallback(
    async (rating) => {
      if (!user) {
        navigate("/login");
        return;
      }
      await updateRating(user.id, animeId, rating);
    },
    [user, animeId, updateRating, navigate]
  );

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await addOrUpdateReview(user.id, animeId, reviewText);
    setReviewText("");
    fetchReviewsForAnime(animeId);
  }, [
    user,
    animeId,
    reviewText,
    addOrUpdateReview,
    navigate,
    fetchReviewsForAnime,
  ]);

  if (loading || loadingFavorites || loadingRatings || loadingAnimeReviews) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!localAnimeDetails) {
    return <div className="error">Anime not found.</div>;
  }

  const {
    title,
    score,
    synopsis,
    coverPhoto,
    popularity,
    releaseDate,
    number_of_episodes,
    number_of_seasons,
    status,
    posterPath,
  } = localAnimeDetails;

  const cast = animeCasts[animeId] || [];
  const crew = animeCrews[animeId] || [];
  const photos = animePhotos[animeId] || [];
  const videos = animeVideos[animeId] || [];

  return (
    <div className="anime-details-container">
      <div className="anime-details-content">
        <div className="left-section">
          {coverPhoto && (
            <img
              src={coverPhoto}
              alt={`${title} Cover`}
              className="poster-image"
            />
          )}

          <div className="title-and-score">
            <h1>
              {title}{" "}
              {user && (
                <span onClick={handleToggleFavorite} className="favorite-icon">
                  {isFavorite ? <SolidStar color="#ffc107" /> : <RegularStar />}
                </span>
              )}
            </h1>
            <p className="score">
              Score:{" "}
              <span className="highlight">
                {score !== null ? score : "N/A"}
              </span>
            </p>
          </div>

          <div className="rating">
            {[...Array(10)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <span
                  key={ratingValue}
                  className="star"
                  onClick={() => handleRatingClick(ratingValue)}
                  onMouseEnter={() => handleRatingHover(ratingValue)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {ratingValue <= (hoverRating || userRating) ? (
                    <FilledStar color="#ffc107" />
                  ) : (
                    <OutlineStar />
                  )}
                </span>
              );
            })}
          </div>

          {releaseDate && (
            <p>
              Release Date:{" "}
              <span className="highlight">
                {new Date(releaseDate).toLocaleDateString()}
              </span>
            </p>
          )}
          {genres.length > 0 && (
            <p>
              Genres: <span className="highlight">{genres.join(", ")}</span>
            </p>
          )}
          {popularity && (
            <p>
              Popularity: <span className="highlight">{popularity}</span>
            </p>
          )}
          <p>
            Status: <span className="highlight">{status}</span>
          </p>
          <p>
            Number of Episodes:{" "}
            <span className="highlight">{number_of_episodes}</span>
          </p>
          <p>
            Number of Seasons:{" "}
            <span className="highlight">{number_of_seasons}</span>
          </p>
          <p>
            Date Created:{" "}
            <span className="highlight">
              {new Date(localAnimeDetails.date_created).toLocaleDateString()}
            </span>
          </p>
          <p>
            Date Updated:{" "}
            <span className="highlight">
              {new Date(localAnimeDetails.date_updated).toLocaleDateString()}
            </span>
          </p>
        </div>

        <div className="right-section">
          {posterPath && (
            <div className="poster-container">
              <img
                src={posterPath}
                alt={`${title} Poster`}
                className="poster-image"
              />
            </div>
          )}
          {synopsis && (
            <>
              <h2>Synopsis</h2>
              <p className="synopsis">{synopsis}</p>
            </>
          )}

          {videos && videos.length > 0 && (
            <div className="videos">
              <h2>Videos</h2>
              <div className="video-list">
                {videos.map((video) => (
                  <iframe
                    key={video.id}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          )}

          {photos && photos.length > 0 && (
            <div className="photos">
              <h2>Photos</h2>
              <div className="photo-list">
                {photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={`Anime Photo ${photo.id}`}
                    className="anime-photo"
                  />
                ))}
              </div>
            </div>
          )}

          {(cast.length > 0 || crew.length > 0) && (
            <div className="credits">
              <h2>Credits</h2>
              {cast.length > 0 && (
                <>
                  <h3>Cast</h3>
                  <div className="cast-list">
                    {cast.map((person) => (
                      <div key={person.id} className="cast-member">
                        <div className="cast-image-container">
                          {person.profile_path ? (
                            <img
                              src={
                                person.profile_path.startsWith("http")
                                  ? person.profile_path
                                  : `https://image.tmdb.org/t/p/original${person.profile_path}`
                              }
                              alt={person.name}
                              className="cast-image"
                            />
                          ) : (
                            <span className="initials-circle">
                              {getInitials(person.name)}
                            </span>
                          )}
                        </div>
                        <p>
                          <strong>{person.name}</strong> as {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {crew.length > 0 && (
                <>
                  <h3>Crew</h3>
                  <div className="crew-list">
                    {crew.map((person) => (
                      <div key={person.id} className="crew-member">
                        <div className="cast-image-container">
                          {person.profile_path ? (
                            <img
                              src={
                                person.profile_path.startsWith("http")
                                  ? person.profile_path
                                  : `https://image.tmdb.org/t/p/original${person.profile_path}`
                              }
                              alt={person.name}
                              className="cast-image"
                            />
                          ) : (
                            <span className="initials-circle">
                              {getInitials(person.name)}
                            </span>
                          )}
                        </div>
                        <p>
                          <strong>{person.name}</strong> ({person.job})
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {user && (
            <div className="review-section">
              <h2>Reviews</h2>
              <div className="all-reviews">
                {animeReviews.map((review) => (
                  <div key={review.id} className="user-review">
                    <h3>{review.username}</h3>
                    <p>{review.reviewText}</p>
                    {review.reviewDate && (
                      <p className="review-date">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
              />
              <button
                className="submit-review-button"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
