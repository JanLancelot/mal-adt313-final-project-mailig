import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AnimeContext = createContext();
const API_BASE_URL = "http://localhost/mal-project/";

export function AnimeProvider({ children }) {
  const [state, setState] = useState({
    animeList: [],
    availableGenres: [],
    topAnime: [],
    animeCasts: {},
    animeCrews: {},
    animePhotos: {},
    animeVideos: {},
    loading: true,
    error: null,
  });

  const { token } = useAuth();

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

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
    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const { data: animeData } = await api.get("anime_operations.php");
      const sortedTopAnime = [...animeData]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const animeCasts = {};
      const animeCrews = {};
      const animePhotos = {};
      const animeVideos = {};

      await Promise.all(
        animeData.map(async (anime) => {
          try {
            const [castData, crewData, photosData, videosData] =
              await Promise.all([
                api.get(`cast_operations.php?anime_id=${anime.id}`),
                api.get(`crew_operations.php?anime_id=${anime.id}`),
                api.get(`photos_operations.php?anime_id=${anime.id}`),
                api.get(`videos_operations.php?anime_id=${anime.id}`),
              ]);
            animeCasts[anime.id] = castData.data;
            animeCrews[anime.id] = crewData.data;
            animePhotos[anime.id] = photosData.data;
            animeVideos[anime.id] = videosData.data;
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
        availableGenres: extractAllGenres(animeData),
        topAnime: sortedTopAnime,
        animeCasts,
        animeCrews,
        animePhotos,
        animeVideos,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Failed to fetch anime data",
      }));
    }
  }, [api, extractAllGenres]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const apiOperations = useMemo(
    () => ({
      addAnime: async (newAnime) => {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));
        try {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          newAnime.date_created = currentDate;
          newAnime.date_updated = currentDate;

          const { data: animeData } = await api.post(
            "anime_operations.php",
            newAnime
          );

          console.log("New Anime: ", newAnime);

          console.log("Anime Data: ", animeData);
          
          

          if (!animeData || !animeData.id) {
            throw new Error("Failed to add anime or retrieve ID");
          }

          const animeId = animeData.id;

          const handleData = async (data, endpoint) => {
            if (!Array.isArray(data) || data.length === 0) return;
            const promises = data.map((item) =>
              api.post(endpoint, { data: item, anime_id: animeId })
            );
            await Promise.all(promises);
          };

          const parsedCast =
            typeof newAnime.cast === "string"
              ? JSON.parse(newAnime.cast)
              : newAnime.cast;
          const parsedCrew =
            typeof newAnime.crew === "string"
              ? JSON.parse(newAnime.crew)
              : newAnime.crew;
          const parsedPhotos =
            typeof newAnime.photos === "string"
              ? JSON.parse(newAnime.photos)
              : newAnime.photos;
          const parsedVideos =
            typeof newAnime.videos === "string"
              ? JSON.parse(newAnime.videos)
              : newAnime.videos;

          await handleData(parsedCast, "cast_operations.php");
          await handleData(parsedCrew, "crew_operations.php");
          await handleData(parsedPhotos, "photos_operations.php");
          await handleData(parsedVideos, "videos_operations.php");

          fetchAnime();
        } catch (error) {
          console.error("Failed to add anime:", error);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: "Failed to add anime",
          }));
        }
      },

      // Legacy code
      updateAnime: async (updatedAnime) => {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));
        try {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          updatedAnime.date_updated = currentDate;

          await api.put("anime_operations.php", updatedAnime);
          const animeId = updatedAnime.id;

          const handleData = async (data, endpoint, deleteEndpoint) => {
            await api.delete(deleteEndpoint, {
              data: { anime_id: animeId },
            });

            if (!Array.isArray(data) || data.length === 0) return;

            const promises = data.map((item) =>
              api.post(endpoint, { data: item, anime_id: animeId })
            );
            await Promise.all(promises);
          };

          const parsedCast =
            typeof updatedAnime.cast === "string"
              ? JSON.parse(updatedAnime.cast)
              : updatedAnime.cast;
          const parsedCrew =
            typeof updatedAnime.crew === "string"
              ? JSON.parse(updatedAnime.crew)
              : updatedAnime.crew;
          const parsedPhotos =
            typeof updatedAnime.photos === "string"
              ? JSON.parse(updatedAnime.photos)
              : updatedAnime.photos;
          const parsedVideos =
            typeof updatedAnime.videos === "string"
              ? JSON.parse(updatedAnime.videos)
              : updatedAnime.videos;

          await handleData(
            parsedCast,
            "cast_operations.php",
            "cast_operations.php"
          );
          await handleData(
            parsedCrew,
            "crew_operations.php",
            "crew_operations.php"
          );
          await handleData(
            parsedPhotos,
            "photos_operations.php",
            "photos_operations.php"
          );
          await handleData(
            parsedVideos,
            "videos_operations.php",
            "videos_operations.php"
          );

          fetchAnime();
        } catch (error) {
          console.error("Failed to update anime:", error);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: "Failed to update anime",
          }));
        }
      },
      
      deleteAnime: async (id) => {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));
        try {
          await api.delete("anime_operations.php", { data: { id } });
          fetchAnime();
        } catch (error) {
          console.error("Failed to delete anime:", error);
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: "Failed to delete anime",
          }));
        }
      },
    }),
    [api, fetchAnime]
  );

  const contextValue = useMemo(
    () => ({
      fetchAnime,
      ...state,
      ...apiOperations,
    }),
    [state, apiOperations]
  );

  if (state.loading) {
    return <div className="loading">Loading...</div>;
  }

  if (state.error) {
    return <div className="error">{state.error}</div>;
  }

  return (
    <AnimeContext.Provider value={contextValue}>
      {children}
    </AnimeContext.Provider>
  );
}

AnimeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAnime = () => useContext(AnimeContext);
