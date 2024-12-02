import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext(null);
const API_BASE_URL = "http://localhost/mal-project";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            fetchFavorites(user.id);
            fetchReviews(user.id);
        } else {
            localStorage.removeItem('user');
            setFavorites([]);
            setLoadingReviews(false);
        }
    }, [user]);

    const fetchReviews = useCallback(async (userId) => {
        setLoadingReviews(true);
        try {
            const reviewsResponse = await axios.get(`${API_BASE_URL}/get_user_reviews.php?userId=${userId}`);
            setReviews(reviewsResponse.data.reviews || []);
        } catch (err) {
            console.error("Error fetching user reviews:", err);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    }, []);

    const fetchFavorites = useCallback(async (userId) => {
        setLoadingFavorites(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/get_favorites.php?userId=${userId}`
            );
            if (response.data && response.data.favorites) {
                const fetchedFavorites = JSON.parse(response.data.favorites) || [];

                const validFavorites = [];
                for (const animeId of fetchedFavorites) {
                    try {
                        const animeResponse = await axios.get(`${API_BASE_URL}/anime_operations.php?id=${animeId}`);
                        if (animeResponse.data && animeResponse.data.length > 0) {
                            validFavorites.push(animeId);
                        } else {
                            await axios.post(`${API_BASE_URL}/update_favorites.php`, {
                                userId: userId,
                                animeId: animeId,
                                action: 'remove',
                            });
                        }
                    } catch (error) {
                        console.error(`Error checking anime ${animeId}:`, error);
                    }
                }
                setFavorites(validFavorites);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setFavorites([]);
        } finally {
            setLoadingFavorites(false);
        }
    }, []);

    const updateFavorites = useCallback(async (userId, animeId, action) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/update_favorites.php`,
                {
                    userId,
                    animeId: parseInt(animeId),
                    action,
                }
            );

            if (response.data.success) {
                if (action === "add") {
                    setFavorites([...favorites, parseInt(animeId)]);
                } else if (action === "remove") {
                    setFavorites(favorites.filter(favId => favId !== parseInt(animeId)));
                }
            } else {
                console.error(response.data.message || "Failed to update favorites.");
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    }, [favorites]);

    function login (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored:', userData);
    };

    function logout () {
        setUser(null);
        localStorage.removeItem('user');
    };

    const contextValue = {
        user,
        favorites,
        loadingFavorites,
        login,
        logout,
        updateFavorites,
        reviews,
        loadingReviews,
        fetchReviews
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => React.useContext(AuthContext);