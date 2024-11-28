import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [topAnime, setTopAnime] = useState([]);

    useEffect(() => {
        fetchAnime();
    }, []);

    const fetchAnime = async () => {
        try {
            const response = await axios.get('http://localhost/mal-project/anime_operations.php');
            const animeData = response.data;
            setAnimeList(animeData);
            setLoading(false);
            extractAllGenres(animeData);

            const sortedAnime = [...animeData].sort((a, b) => b.score - a.score);
            setTopAnime(sortedAnime.slice(0, 3));

        } catch (err) {
            setError('Failed to fetch anime list', err);
            setLoading(false);
        }
    };

    const extractAllGenres = (animes) => {
        const genres = new Set();
        animes.forEach(anime => {
            if (anime.genres) {
                try {
                    const parsedGenres = JSON.parse(anime.genres);
                    parsedGenres.forEach(genre => genres.add(genre));
                } catch (e) {
                    console.error("Failed to parse genres for anime", anime, e);
                }
            }
        });
        setAvailableGenres(Array.from(genres));
    };

    const addAnime = async (newAnime) => {
        try {
            const response = await axios.post('http://localhost/mal-project/anime_operations.php', newAnime);
            if (response.data.success) {
                fetchAnime();
            } else {
                setError('Failed to add new anime: ' + response.data.message);
            }
        } catch (err) {
            setError('Failed to add new anime', err);
        }
    };

    const updateAnime = async (updatedAnime) => {
        try {
            await axios.put('http://localhost/mal-project/anime_operations.php', updatedAnime);
            fetchAnime();
        } catch (err) {
            setError('Failed to update anime', err);
        }
    };

    const deleteAnime = async (id) => {
        try {
            await axios.delete('http://localhost/mal-project/anime_operations.php', { data: { id } });
            fetchAnime();
        } catch (err) {
            setError('Failed to delete anime', err);
        }
    };

    const value = {
        animeList,
        loading,
        error,
        availableGenres,
        topAnime,
        addAnime,
        updateAnime,
        deleteAnime,
        fetchAnime
    };

    return (
        <AnimeContext.Provider value={value}>
            {loading ? <div className="loading">Loading...</div> : !error ? children : <div className="error">{error}</div>}
        </AnimeContext.Provider>
    );
};

AnimeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAnime = () => useContext(AnimeContext);
