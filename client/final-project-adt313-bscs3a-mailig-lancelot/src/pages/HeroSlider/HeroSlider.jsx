import { useState, useEffect } from 'react';
import './HeroSlider.css';
import PropTypes from 'prop-types';

const HeroSlider = ({ animes }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const intervalId = setInterval(() => {
            handleNext();
        }, 6000);

        return () => clearInterval(intervalId);
    }, [currentIndex, isAutoPlaying]);

    function handlePrevious () {
        setCurrentIndex((prev) => (prev === 0 ? animes.length - 1 : prev - 1));
    };

    function handleNext() {
        setCurrentIndex((prev) => (prev + 1) % animes.length);
    };

    // const formatNumber = (num) => {
    //     return num.toString().padStart(2, '0');
    // };

    if (!animes || animes.length === 0) return null;

    return (
        <div className="hero-slider"
             onMouseEnter={() => setIsAutoPlaying(false)}
             onMouseLeave={() => setIsAutoPlaying(true)}>
            <div className="visual-section">
                {animes.map((anime, index) => (
                    <div key={anime.id} 
                         className={`slide ${index === currentIndex ? 'active' : ''}`}>
                        <div className="slide-image"
                             style={{ backgroundImage: `url(${anime.coverPhoto})` }}/>
                        <div className="slide-overlay" />
                    </div>
                ))}
            
            </div>

            <div className="info-section">
                <div className={`info-content ${currentIndex === currentIndex ? 'active' : ''}`}>
                    {/* <div className="anime-number">
                        <span className="current-number">{formatNumber(currentIndex + 1)}</span>
                        /{formatNumber(animes.length)}
                    </div> */}
                    <h2 className="anime-title">{animes[currentIndex].title}</h2>
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
                                className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                    <div className="nav-arrows">
                        <button className="nav-arrow" onClick={handlePrevious}>←</button>
                        <button className="nav-arrow" onClick={handleNext}>→</button>
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
            title: PropTypes.string.isRequired,
            synopsis: PropTypes.string,
            coverPhoto: PropTypes.string,
            rating: PropTypes.string,
            episodes: PropTypes.number,
        })
    ).isRequired,
};

export default HeroSlider;