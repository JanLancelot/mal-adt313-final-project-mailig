import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AnimeContext = createContext();
const API_BASE_URL = 'http://localhost/mal-project/anime_operations.php';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 5000
});

export function AnimeProvider({ children }) {
    const [state, setState] = useState({
        animeList: [],
        loading: true,
        error: null,
        availableGenres: [],
        topAnime: []
    });

    console.log("Anime List: ", state.animeList);
    

    const extractAllGenres = useCallback((animes) => {
        const genres = new Set();
        animes.forEach(anime => {
            if (!anime.genres) return;
            
            try {
                const parsedGenres = JSON.parse(anime.genres);
                parsedGenres.forEach(genre => genres.add(genre));
            } catch (e) {
                console.error("Failed to parse genres for anime:", anime.title, e);
            }
        });
        return Array.from(genres);
    }, []);

    const fetchAnime = useCallback(async () => {
        try {
            const { data: animeData } = await axiosInstance.get();
            const sortedTopAnime = [...animeData]
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            setState(prev => ({
                ...prev,
                animeList: animeData,
                loading: false,
                availableGenres: extractAllGenres(animeData),
                topAnime: sortedTopAnime
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: 'Failed to fetch anime list', err,
                loading: false
            }));
        }
    }, [extractAllGenres]);

    useEffect(() => {
        fetchAnime();
    }, [fetchAnime]);

    const apiOperations = {
        addAnime: async (newAnime) => {
            try {
                const { data } = await axiosInstance.post('', newAnime);
                if (data.success) {
                    fetchAnime();
                } else {
                    setState(prev => ({
                        ...prev,
                        error: `Failed to add new anime: ${data.message}`
                    }));
                }
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to add new anime', err
                }));
            }
        },

        updateAnime: async (updatedAnime) => {
            try {
                await axiosInstance.put('', updatedAnime);
                fetchAnime();
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to update anime', err
                }));
            }
        },

        deleteAnime: async (id) => {
            try {
                console.log(id);
                
                await axiosInstance.delete('', { data: { id } });
                fetchAnime();
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to delete anime', err
                }));
            }
        }
    };

    const value = {
        ...state,
        ...apiOperations,
        fetchAnime
    };

    if (state.loading) return <div className="loading">Loading...</div>;
    if (state.error) return <div className="error">{state.error}</div>;
    
    return (
        <AnimeContext.Provider value={value}>
            {children}
        </AnimeContext.Provider>
    );
}

AnimeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAnime = () => {
    const context = useContext(AnimeContext);
    if (!context) {
        throw new Error('useAnime must be used within an AnimeProvider');
    }
    return context;
};