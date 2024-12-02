import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AnimeDetails.css";
import { useAnime } from "../../AnimeContext";
import { useAuth } from "../../AuthContext";
import { FaStar as SolidStar } from "react-icons/fa";
import { FaRegStar as RegularStar } from "react-icons/fa";
import { AiFillStar as FilledStar } from "react-icons/ai";
import { AiOutlineStar as OutlineStar } from "react-icons/ai";

const TMDB_API_KEY = "2c7e4cf1a9c1270547b2397569f7ad40";
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export default function AnimeDetails() {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [localAnimeDetails, setLocalAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const navigate = useNavigate();
  const { animeList } = useAnime();
  const { user, favorites, loadingFavorites, updateFavorites } = useAuth();
  const API_BASE_URL = "http://localhost/mal-project";

  console.log("All reviews: ", allReviews);
  
  const isFavorite = useMemo(() => {
    return favorites && favorites.includes(parseInt(animeId));
  }, [favorites, animeId]);

  useEffect(() => {
    const fetchTMDBDetails = async (tmdbId) => {
      if (!tmdbId) {
        setAnimeDetails(null);
        return;
      }
      try {
        const detailsResponse = await axios.get(
          `${TMDB_API_BASE_URL}/tv/${tmdbId}`,
          {
            params: {
              api_key: TMDB_API_KEY,
              append_to_response: "videos,credits,recommendations,similar",
            },
          }
        );
        setAnimeDetails(detailsResponse.data);
      } catch (err) {
        setError(`Failed to fetch TMDB anime details: ${err.message}`);
      }
    };

    if (animeList.length > 0) {
      setLoading(true);
      setError(null);
      const foundAnime = animeList.find(
        (anime) => anime.id === parseInt(animeId)
      );

      if (foundAnime) {
        setLocalAnimeDetails(foundAnime);
        fetchTMDBDetails(foundAnime.tmdb_id);
        if (user) {
          fetchUserRating();
          fetchAllReviews();
        }
      } else {
        setError("Anime not found in local context.");
      }
      setLoading(false);
    }
  }, [animeId, animeList, user, localAnimeDetails]);

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_user_rating.php`, {
        params: {
          userId: user.id,
          animeId: animeId,
        },
      });
      if (response.data && response.data.rating !== null) {
        setUserRating(parseInt(response.data.rating, 10));
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_user_review.php`, {
        params: {
          animeId: animeId,
        },
      });
      if (response.data && response.data.reviews) {
        setAllReviews(response.data.reviews);
      }
    } catch (error) {
      console.error("Error fetching all reviews:", error);
    }
  };

  const parsedLocalGenres = useMemo(() => {
    if (!localAnimeDetails || !localAnimeDetails.genres) return [];
    try {
      const genres = JSON.parse(localAnimeDetails.genres);
      return Array.isArray(genres) ? genres : [];
    } catch (e) {
      console.error(
        "Failed to parse genres string:",
        localAnimeDetails.genres,
        e
      );
      return [];
    }
  }, [localAnimeDetails]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await updateFavorites(user.id, parseInt(animeId), isFavorite ? "remove" : "add");
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingClick = async (rating) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/update_user_rating.php`, {
        userId: user.id,
        animeId: animeId,
        rating: rating,
      });
      setUserRating(rating);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/update_user_review.php`, {
        userId: user.id,
        animeId: animeId,
        reviewText: reviewText,
      });
      fetchAllReviews();
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading || loadingFavorites) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!localAnimeDetails)
    return <div className="loading">No anime details found.</div>;

  const { title, score, synopsis, coverPhoto, popularity, releaseDate } =
    localAnimeDetails;

  const {
    name,
    overview,
    poster_path,
    vote_average,
    first_air_date,
    genres,
    number_of_episodes,
    number_of_seasons,
    videos,
    credits,
    recommendations,
    similar,
  } = animeDetails || {};

  return (
    <div className="anime-details-container">
      {/* <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button> */}
      <div className="anime-details-content">
        <div className="left-section">
          {coverPhoto ? (
            <img
              src={coverPhoto}
              alt={`${title || name} Cover`}
              className="poster-image"
            />
          ) : poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${poster_path}`}
              alt={`${name} Poster`}
              className="poster-image"
            />
          ) : null}

          <div className="title-and-score">
            <h1>
              {title || name}{" "}
              {user && (
                <span onClick={handleToggleFavorite} className="favorite-icon">
                  {isFavorite ? <SolidStar color="#ffc107" /> : <RegularStar />}
                </span>
              )}
            </h1>
            <p className="score">
              Score:{" "}
              <span className="highlight">
                {score !== null
                  ? score
                  : vote_average > 0
                  ? vote_average
                  : "N/A"}
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
          {first_air_date && (
            <p>
              First Air Date:{" "}
              <span className="highlight">
                {new Date(first_air_date).toLocaleDateString()}
              </span>
            </p>
          )}

          {parsedLocalGenres.length > 0 ? (
            <p>
              Genres:{" "}
              <span className="highlight">
                {parsedLocalGenres.map((genre) => genre).join(", ")}
              </span>
            </p>
          ) : (
            genres &&
            genres.length > 0 && (
              <p>
                Genres:{" "}
                <span className="highlight">
                  {genres.map((genre) => genre.name).join(", ")}
                </span>
              </p>
            )
          )}

          {number_of_episodes && (
            <p>
              Number of Episodes:{" "}
              <span className="highlight">{number_of_episodes}</span>
            </p>
          )}
          {number_of_seasons && (
            <p>
              Number of Seasons:{" "}
              <span className="highlight">{number_of_seasons}</span>
            </p>
          )}
          {popularity && (
            <p>
              Popularity: <span className="highlight">{popularity}</span>
            </p>
          )}
        </div>

        <div className="right-section">
          {synopsis || overview ? (
            <>
              <h2>Synopsis</h2>
              <p className="synopsis">{synopsis || overview}</p>
            </>
          ) : null}

          {videos && videos.results.length > 0 && (
            <div className="videos">
              <h2>Videos</h2>
              <div className="video-list">
                {videos.results.slice(0, 3).map((video) => (
                  <iframe
                    key={video.key}
                    width="300"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          )}

          {credits && (credits.cast.length > 0 || credits.crew.length > 0) && (
            <div className="credits">
              <h2>Credits</h2>
              {credits.cast.length > 0 && (
                <>
                  <h3>Cast</h3>
                  <div className="cast-list">
                    {credits.cast.slice(0, 5).map((person) => (
                      <div key={person.id} className="cast-member">
                        {person.profile_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            className="cast-image"
                          />
                        )}
                        <p>
                          {person.name} as {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {credits.crew.length > 0 && (
                <>
                  <h3>Crew</h3>
                  <div className="crew-list">
                    {credits.crew.slice(0, 5).map((person) => (
                      <div key={person.id} className="crew-member">
                        <p>
                          {person.name} ({person.job})
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {recommendations && recommendations.results.length > 0 && (
            <div className="recommendations">
              <h2>Recommendations</h2>
              <div className="recommendations-list">
                {recommendations.results.slice(0, 5).map((recommendation) => (
                  <div key={recommendation.id} className="recommendation-item">
                    {recommendation.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`}
                        alt={recommendation.name}
                        className="recommendation-image"
                      />
                    )}
                    <p>{recommendation.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {similar && similar.results.length > 0 && (
            <div className="similar-shows">
              <h2>Similar Shows</h2>
              <div className="similar-shows-list">
                {similar.results.slice(0, 5).map((show) => (
                  <div key={show.id} className="similar-show-item">
                    {show.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                        alt={show.name}
                        className="similar-show-image"
                      />
                    )}
                    <p>{show.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {user && (
            <div className="review-section">
              {/* <h2>Your Review</h2>  */}
              <h2>Reviews</h2>
              <div className="all-reviews">
                {allReviews.map((review) => (
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
              <button onClick={handleSubmitReview}>Submit Review</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
