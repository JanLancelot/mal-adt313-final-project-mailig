import { createContext, useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext(null);
const API_BASE_URL = "http://localhost/mal-project";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [state, setState] = useState({
    favorites: [],
    reviews: [],
    ratings: {},
    loading: {
      favorites: true,
      reviews: true,
      ratings: true,
    },
    error: null,
  });

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
    });

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return instance;
  }, [token]);

  const apiOperations = useMemo(
    () => ({
      fetchFavorites: async (userId) => {
        setState((prevState) => ({
          ...prevState,
          loading: { ...prevState.loading, favorites: true },
          error: null,
        }));
        try {
          const response = await api.get(
            `/favorites_operations.php?userId=${userId}`
          );

          if (response.data && response.data.favorites) {
            const fetchedFavorites = response.data.favorites;
            const validFavorites = [];

            for (const animeId of fetchedFavorites) {
              try {
                const animeResponse = await api.get(
                  `/anime_operations.php?id=${animeId}`
                );
                if (animeResponse.data && animeResponse.data.length > 0) {
                  validFavorites.push(animeId);
                } else {
                  await api.post(`/favorites_operations.php`, {
                    userId: userId,
                    animeId: animeId,
                    action: "remove",
                  });
                  console.warn(`Removed invalid favorite animeId: ${animeId}`);
                }
              } catch (error) {
                console.error(`Error checking anime ${animeId}:`, error);
                setState((prevState) => ({
                  ...prevState,
                  error: "Error checking favorite animes",
                }));
              }
            }
            setState((prevState) => ({
              ...prevState,
              favorites: validFavorites,
            }));
          } else {
            setState((prevState) => ({ ...prevState, favorites: [] }));
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error fetching favorites",
            favorites: [],
          }));
        } finally {
          setState((prevState) => ({
            ...prevState,
            loading: { ...prevState.loading, favorites: false },
          }));
        }
      },

      fetchReviews: async (userId) => {
        setState((prevState) => ({
          ...prevState,
          loading: { ...prevState.loading, reviews: true },
          error: null,
        }));
        try {
          const reviewsResponse = await api.get(
            `/review_operations.php?userId=${userId}`
          );
          setState((prevState) => ({
            ...prevState,
            reviews: reviewsResponse.data.reviews || [],
          }));
        } catch (error) {
          console.error("Error fetching user reviews:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error fetching user reviews",
            reviews: [],
          }));
        } finally {
          setState((prevState) => ({
            ...prevState,
            loading: { ...prevState.loading, reviews: false },
          }));
        }
      },

      updateFavorites: async (userId, animeId, action) => {
        setState((prevState) => ({ ...prevState, error: null }));
        try {
          const response = await api.post(`/favorites_operations.php`, {
            userId,
            animeId: parseInt(animeId),
            action,
          });

          if (response.data.success) {
            setState((prevState) => ({
              ...prevState,
              favorites:
                action === "add"
                  ? [...prevState.favorites, parseInt(animeId)]
                  : prevState.favorites.filter(
                      (favId) => favId !== parseInt(animeId)
                    ),
            }));
          } else {
            const errorMessage =
              response.data.message || "Failed to update favorites.";
            console.error(errorMessage);
            setState((prevState) => ({ ...prevState, error: errorMessage }));
          }
        } catch (error) {
          console.error("Error updating favorites:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error updating favorites",
          }));
        }
      },

      fetchRatingForAnime: async (userId, animeId) => {
        if (!userId || !animeId) {
          const errorMessage = "Missing userId or animeId for fetching rating";
          console.error(errorMessage);
          setState((prevState) => ({ ...prevState, error: errorMessage }));
          return;
        }

        setState((prevState) => ({
          ...prevState,
          loading: { ...prevState.loading, ratings: true },
          error: null,
        }));
        try {
          const response = await api.get(
            `/ratings_operations.php?userId=${userId}&animeId=${animeId}`
          );

          if (response.data.error) {
            console.error("Error fetching rating:", response.data.error);
            setState((prevState) => ({
              ...prevState,
              error: "Error fetching rating",
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              ratings: {
                ...prevState.ratings,
                [animeId]: response.data.rating,
              },
            }));
          }
        } catch (error) {
          console.error("Error fetching rating:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error fetching rating",
          }));
        } finally {
          setState((prevState) => ({
            ...prevState,
            loading: { ...prevState.loading, ratings: false },
          }));
        }
      },

      updateRating: async (userId, animeId, rating) => {
        setState((prevState) => ({ ...prevState, error: null }));
        try {
          const response = await api.post(`/ratings_operations.php`, {
            userId,
            animeId,
            rating,
          });

          if (response.data.success) {
            setState((prevState) => ({
              ...prevState,
              ratings: {
                ...prevState.ratings,
                [animeId]: rating,
              },
            }));
            console.log(response.data.message);
          } else {
            const errorMessage =
              response.data.error || "Failed to update rating.";
            console.error(errorMessage);
            setState((prevState) => ({ ...prevState, error: errorMessage }));
          }
        } catch (error) {
          console.error("Error updating rating:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error updating rating",
          }));
        }
      },

      addOrUpdateReview: async (userId, animeId, reviewText) => {
        setState((prevState) => ({ ...prevState, error: null }));
        try {
          const response = await api.post(`/review_operations.php`, {
            userId,
            animeId,
            reviewText,
          });

          if (response.data.success) {
            apiOperations.fetchReviews(userId);
            console.log(response.data.message);
          } else {
            const errorMessage =
              response.data.error || "Failed to add/update review.";
            console.error(errorMessage);
            setState((prevState) => ({ ...prevState, error: errorMessage }));
          }
        } catch (error) {
          console.error("Error adding/updating review:", error);
          setState((prevState) => ({
            ...prevState,
            error: "Error adding/updating review",
          }));
        }
      },

      login: (userData) => {
        setUser(userData);
        setToken(userData.token);
        setState((prevState) => ({ ...prevState, error: null }));
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        console.log("User data and token stored:", userData);
      },

      logout: () => {
        setUser(null);
        setToken(null);
        setState({
          favorites: [],
          reviews: [],
          ratings: {},
          loading: {
            favorites: false,
            reviews: false,
            ratings: false,
          },
          error: null,
        });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      },
    }),
    [api, user]
  );

  useEffect(() => {
    if (user && token) {
      apiOperations.fetchFavorites(user.id);
      apiOperations.fetchReviews(user.id);
    } else {
      setState({
        favorites: [],
        reviews: [],
        ratings: {},
        loading: {
          favorites: false,
          reviews: false,
          ratings: false,
        },
        error: null,
      });
    }
  }, [user, token, apiOperations]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      ...state,
      ...apiOperations,
    }),
    [user, token, state, apiOperations]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
