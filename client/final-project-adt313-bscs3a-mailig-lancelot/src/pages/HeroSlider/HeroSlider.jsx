import { useState, useEffect, useMemo, useCallback } from "react";
import "./HeroSlider.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAnime } from "../../AnimeContext";

export default function HeroSlider({ animes }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { animePhotos } = useAnime();
  const [relatedPhoto, setRelatedPhoto] = useState(null);

  console.log("Related Photo: ", animePhotos);

  const getRelatedPhotoFromContext = useCallback(() => {
    const animeId = animes && animes[currentIndex] && animes[currentIndex].id;
    if (
      animeId &&
      animePhotos &&
      animePhotos[animeId.toString()] &&
      animePhotos[animeId.toString()].length > 0
    ) {
      const photosForAnime = animePhotos[animeId.toString()];
      const coverPhoto = photosForAnime.find((p) => p.is_cover === 1);

      if (coverPhoto) {
        setRelatedPhoto(coverPhoto.url);
        setLoading(false);
        return true;
      } else {
        const firstPhoto = photosForAnime[0];
        if (firstPhoto) {
          setRelatedPhoto(firstPhoto.url);
          setLoading(false);
          return true;
        }
      }
    }

    setRelatedPhoto(null);
    setLoading(false);
    return false;
  }, [animes, currentIndex, animePhotos]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  }, [animes.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const intervalId = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [currentIndex, isAutoPlaying, handleNext]);

  useEffect(() => {
    let photoFound = getRelatedPhotoFromContext();
    if (!photoFound) {
      setRelatedPhoto(null);
      setLoading(false);
    }
  }, [currentIndex, animes, getRelatedPhotoFromContext]);

  const currentAnimeGenres = useMemo(() => {
    if (!animes || !animes[currentIndex] || !animes[currentIndex].genres) {
      return [];
    }
    try {
      return JSON.parse(animes[currentIndex].genres);
    } catch (e) {
      console.error("Failed to parse genres", e);
      return [];
    }
  }, [animes, currentIndex]);

  const handleViewDetails = useCallback(() => {
    if (animes[currentIndex] && animes[currentIndex].id) {
      navigate(`/anime/${animes[currentIndex].id}`);
    }
  }, [animes, currentIndex, navigate]);

  if (!animes || animes.length === 0) return null;

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="visual-section">
        {relatedPhoto && (
          <img
            src={relatedPhoto}
            alt="Related"
            className={`related-image ${
              loading ? "image-loading" : "image-loaded"
            }`}
          />
        )}
        <div className="slide-overlay" />
      </div>

      <div className="info-section">
        <div
          className={`info-content ${
            currentIndex === currentIndex ? "active" : ""
          }`}
        >
          <h2 className="anime-title">{animes[currentIndex].title}</h2>
          <div className="anime-genres">
            {currentAnimeGenres.map((genre, index) => (
              <span key={index} className="anime-genre">
                {genre}
              </span>
            ))}
          </div>
          <p className="anime-synopsis">{animes[currentIndex].synopsis}</p>

          <div className="cta-container">
            <button
              className="cta-button watch-now"
              onClick={handleViewDetails}
            >
              View Details
            </button>
          </div>
        </div>

        <div className="navigation">
          <div className="nav-dots">
            {animes.map((_, index) => (
              <span
                key={index}
                className={`nav-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

HeroSlider.propTypes = {
  animes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      synopsis: PropTypes.string,
      coverPhoto: PropTypes.string,
      rating: PropTypes.string,
      episodes: PropTypes.number,
      genres: PropTypes.string,
    })
  ).isRequired,
};
