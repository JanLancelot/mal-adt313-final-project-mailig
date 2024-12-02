import { useState, useEffect, useMemo, useCallback } from "react";
import "./HeroSlider.css";
import PropTypes from "prop-types";
import axios from "axios";

const TMDB_API_KEY = "2c7e4cf1a9c1270547b2397569f7ad40";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const HeroSlider = ({ animes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [relatedPhoto, setRelatedPhoto] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRelatedPhoto = useCallback(async (tmdb_id) => {
        setLoading(true);
        try {
            const imagesResponse = await axios.get(
                `${TMDB_BASE_URL}/tv/${tmdb_id}/images`,
                {
                    params: { api_key: TMDB_API_KEY },
                }
            );
            if (imagesResponse.data.backdrops.length > 0) {
                setRelatedPhoto(
                    `https://image.tmdb.org/t/p/original${imagesResponse.data.backdrops[0].file_path}`
                );
            } else {
                setRelatedPhoto(null);
            }
        } catch (err) {
            console.error("Failed to fetch related photo:", err);
            setRelatedPhoto(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, [animes.length]);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const intervalId = setInterval(() => {
            handleNext();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [currentIndex, isAutoPlaying, handleNext]);

    useEffect(() => {
        if (animes[currentIndex] && animes[currentIndex].tmdb_id) {
            fetchRelatedPhoto(animes[currentIndex].tmdb_id);
        }
    }, [currentIndex, animes, fetchRelatedPhoto]);

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

    if (!animes || animes.length === 0) return null;

    return (
        <div
            className="hero-slider"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="visual-section">
                {/* {animes.map((anime, index) => (
                    <div key={anime.id} 
                         className={`slide ${index === currentIndex ? 'active' : ''}`}>
                        <div className="slide-image"
                             style={{ backgroundImage: `url(${anime.coverPhoto})` }}/>
                        <div className="slide-overlay" />
                    </div>
                ))} */}

                {relatedPhoto && (
                    <img
                        src={relatedPhoto}
                        alt="Related"
                        className={`related-image ${loading ? 'image-loading' : 'image-loaded'}`}
                    />
                )}
                <div className="slide-overlay" />
            </div>

            <div className="info-section">
                <div
                    className={`info-content ${currentIndex === currentIndex ? "active" : ""
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
                        <button className="cta-button watch-now">Watch Now</button>
                        <button className="cta-button add-list">Add to List</button>
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
};

HeroSlider.propTypes = {
    animes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            tmdb_id: PropTypes.number,
            title: PropTypes.string.isRequired,
            synopsis: PropTypes.string,
            coverPhoto: PropTypes.string,
            rating: PropTypes.string,
            episodes: PropTypes.number,
            genres: PropTypes.string,
        })
    ).isRequired,
};

export default HeroSlider;