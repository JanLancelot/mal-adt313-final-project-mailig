import { createContext, useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AnimeContext = createContext();
const API_BASE_URL = "http://localhost/mal-project/";

const animeAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "anime_operations.php",
  timeout: 5000,
});

const castAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "cast_operations.php",
  timeout: 5000,
});

const crewAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "crew_operations.php",
  timeout: 5000,
});

const photosAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "photos_operations.php",
  timeout: 5000,
});

const videosAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "videos_operations.php",
  timeout: 5000,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export function AnimeProvider({ children }) {
  const [state, setState] = useState({
    animeList: [],
    loading: true,
    error: null,
    availableGenres: [],
    topAnime: [],
    animeCasts: {},
    animeCrews: {},
    animePhotos: {},
    animeVideos: {},
  });

  const extractAllGenres = useCallback((animes) => {
    const genres = new Set();
    animes.forEach((anime) => {
      if (!anime.genres) return;
      try {
        JSON.parse(anime.genres).forEach((genre) => genres.add(genre));
      } catch (e) {
        console.error("Failed to parse genres:", anime.title, e);
      }
    });
    return Array.from(genres);
  }, []);

  const fetchAnime = useCallback(async () => {
    try {
      const { data: animeData } = await animeAxiosInstance.get();
      const sortedTopAnime = [...animeData].sort((a, b) => b.score - a.score).slice(0, 3);
      const animeCasts = {};
      const animeCrews = {};
      const animePhotos = {};
      const animeVideos = {};

      await Promise.all(
        animeData.map(async (anime) => {
          try {
            const { data: castData } = await castAxiosInstance.get(`?anime_id=${anime.id}`);
            animeCasts[anime.id] = castData;

            const { data: crewData } = await crewAxiosInstance.get(`?anime_id=${anime.id}`);
            animeCrews[anime.id] = crewData;

            const { data: photosData } = await photosAxiosInstance.get(`?anime_id=${anime.id}`);
            animePhotos[anime.id] = photosData;

            const { data: videosData } = await videosAxiosInstance.get(`?anime_id=${anime.id}`);
            animeVideos[anime.id] = videosData;
          } catch (error) {
            console.error(`Failed to fetch data for anime ${anime.id}:`, error);
            animeCasts[anime.id] = [];
            animeCrews[anime.id] = [];
            animePhotos[anime.id] = [];
            animeVideos[anime.id] = [];
          }
        })
      );

      setState({
        animeList: animeData,
        loading: false,
        availableGenres: extractAllGenres(animeData),
        topAnime: sortedTopAnime,
        animeCasts,
        animeCrews,
        animePhotos,
        animeVideos,
      });
    } catch (err) {
      setState({
        error: "Failed to fetch data",
        err,
        loading: false,
      });
    }
  }, [extractAllGenres]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const apiOperations = {
    addAnime: async (newAnime) => {
      try {
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        newAnime.date_created = currentDate;
        newAnime.date_updated = currentDate;

        const { data: animeData } = await animeAxiosInstance.post("", newAnime);
        if (!animeData || !animeData.id) {
          throw new Error("Failed to add anime or retrieve ID");
        }

        const animeId = animeData.id;

        const handleData = async (data, endpoint) => {
          if (!Array.isArray(data) || data.length === 0) return;

          const promises = data.map((item) =>
            axiosInstance.post(endpoint, { data: item, anime_id: animeId })
          );
          await Promise.all(promises);
        };

        const parsedCast = typeof newAnime.cast === "string" ? JSON.parse(newAnime.cast) : newAnime.cast;
        const parsedCrew = typeof newAnime.crew === "string" ? JSON.parse(newAnime.crew) : newAnime.crew;
        const parsedPhotos = typeof newAnime.photos === "string" ? JSON.parse(newAnime.photos) : newAnime.photos;
        const parsedVideos = typeof newAnime.videos === "string" ? JSON.parse(newAnime.videos) : newAnime.videos;

        await handleData(parsedCast, "cast_operations.php");
        await handleData(parsedCrew, "crew_operations.php");
        await handleData(parsedPhotos, "photos_operations.php");
        await handleData(parsedVideos, "videos_operations.php");

        fetchAnime();
      } catch (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
      }
    },
    updateAnime: async (updatedAnime) => {
      try {
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        updatedAnime.date_updated = currentDate;

        await animeAxiosInstance.put("", updatedAnime);
        const animeId = updatedAnime.id;

        const handleData = async (data, endpoint, deleteEndpoint) => {
          await axiosInstance.delete(deleteEndpoint, { data: { anime_id: animeId } });

          if (!Array.isArray(data) || data.length === 0) return;

          const promises = data.map((item) =>
            axiosInstance.post(endpoint, { data: item, anime_id: animeId })
          );
          await Promise.all(promises);
        };

        const parsedCast = typeof updatedAnime.cast === "string" ? JSON.parse(updatedAnime.cast) : updatedAnime.cast;
        const parsedCrew = typeof updatedAnime.crew === "string" ? JSON.parse(updatedAnime.crew) : updatedAnime.crew;
        const parsedPhotos = typeof updatedAnime.photos === "string" ? JSON.parse(updatedAnime.photos) : updatedAnime.photos;
        const parsedVideos = typeof updatedAnime.videos === "string" ? JSON.parse(updatedAnime.videos) : updatedAnime.videos;

        await handleData(parsedCast, "cast_operations.php", "cast_operations.php");
        await handleData(parsedCrew, "crew_operations.php", "crew_operations.php");
        await handleData(parsedPhotos, "photos_operations.php", "photos_operations.php");
        await handleData(parsedVideos, "videos_operations.php", "videos_operations.php");

        fetchAnime();
      } catch (err) {
        setState((prev) => ({ ...prev, error: "Failed to update anime: " + err.message, loading: false }));
      }
    },
    deleteAnime: async (id) => {
      try {
        await animeAxiosInstance.delete("", { data: { id } });
        fetchAnime();
      } catch (err) {
        setState((prev) => ({ ...prev, error: "Failed to delete anime: " + err.message, loading: false }));
      }
    },
  };

  const value = { ...state, ...apiOperations, fetchAnime };

  if (state.loading) return <div className="loading">Loading...</div>;
  if (state.error) return <div className="error">{state.error}</div>;

  return <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>;
}

AnimeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnime must be used within an AnimeProvider");
  }
  return context;
};