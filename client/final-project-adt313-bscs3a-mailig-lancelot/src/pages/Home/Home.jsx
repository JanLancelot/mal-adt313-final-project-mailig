import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnime } from "../../AnimeContext";
import "./Home.css";
import { useAuth } from "../../AuthContext";
import HeroSlider from "../HeroSlider/HeroSlider";
import skelly from "../../assets/dancing_skeleton.gif";
import AnimeCard from "../AnimeCard/AnimeCard";


export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterScore, setFilterScore] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [filterGenre, setFilterGenre] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = useMemo(() => user && user.role === "admin", [user]);
    const {
        animeList,
        animeCasts,
        animeCrews,
        animePhotos,
        animeVideos,
        loading,
        error,
        availableGenres,
        topAnime,
        deleteAnime,
    } = useAnime();

    const handleUpdate = useCallback(
        (anime) => {
            navigate(`/update/${anime.id}`);
        },
        [navigate]
    );

    const handleDelete = useCallback(
        async (id) => {
            console.log("Deleted Anime ID: ", id);

            if (window.confirm("Are you sure you want to delete this anime?")) {
                try {
                    await deleteAnime(id);
                } catch (err) {
                    console.error("Failed to delete anime", err);
                }
            }
        },
        [deleteAnime]
    );

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleFilterScoreChange = useCallback((event) => {
        setFilterScore(event.target.value);
    }, []);

    const handleSortChange = useCallback((event) => {
        setSortBy(event.target.value);
    }, []);

    const handleFilterGenreChange = useCallback((event) => {
        setFilterGenre(event.target.value);
    }, []);

    const sortedAnimeList = useMemo(() => {
        let filteredAndSearchedAnimeList = animeList.filter((anime) => {
            const titleMatches = anime.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const scoreMatches =
                filterScore === "" ||
                parseFloat(anime.score) >= parseFloat(filterScore);

            let genreMatches = true;
            if (filterGenre) {
                try {
                    const animeGenres =
                        typeof anime.genres === "string" ? JSON.parse(anime.genres) : [];
                    genreMatches = animeGenres.includes(filterGenre);
                } catch (e) {
                    console.error("Failed to parse genres for anime", anime, e);
                    genreMatches = false;
                }
            }

            return titleMatches && scoreMatches && genreMatches;
        });
        console.log(
            "Filtered Search Anime List Test: ",
            filteredAndSearchedAnimeList
        );

        if (sortBy === "popularity") {
            return [...filteredAndSearchedAnimeList].sort(
                (a, b) => (b.popularity || 0) - (a.popularity || 0)
            );
        } else if (sortBy === "score") {
            return [...filteredAndSearchedAnimeList].sort(
                (a, b) => b.score - a.score
            );
        }
        return filteredAndSearchedAnimeList;
    }, [animeList, searchQuery, filterScore, sortBy, filterGenre]);

    const navToAddAnime = useCallback(() => {
        navigate("/add-anime");
    }, [navigate]);

    console.log("Anime Casts from Home:", animeCasts);
    console.log("Anime Crews from Home:", animeCrews);
    console.log("Anime Photos from Home:", animePhotos);
    console.log("Anime Videos from Home:", animeVideos);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return null;

    return (
        <div>
            <HeroSlider animes={topAnime} />
            <div className="home-container">
                <div className="content">
                    <div className="page-header">
                        <h2>Anime List</h2>
                        {isAdmin && (
                            <button onClick={navToAddAnime} className="add-anime-button">
                                Add Anime
                            </button>
                        )}
                    </div>

                    <div className="search-filter-bar">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <select
                            value={filterScore}
                            onChange={handleFilterScoreChange}
                            className="filter-select"
                        >
                            <option value="">Filter by Score</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                <option key={score} value={score}>
                                    {score}+
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="filter-select"
                        >
                            <option value="">Sort By</option>
                            <option value="popularity">Popularity</option>
                            <option value="score">Score</option>
                        </select>
                        <select
                            value={filterGenre}
                            onChange={handleFilterGenreChange}
                            className="filter-select"
                        >
                            <option value="">Filter by Genre</option>
                            {availableGenres.map((genre, index) => (
                                <option key={index} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {sortedAnimeList.length === 0 && (
                        <div className="no-results">
                            <img
                                src={skelly}
                                alt="No Results Found"
                                className="no-results-image"
                            />
                        </div>
                    )}

                    {sortedAnimeList.length > 0 && (
                        <div className="anime-grid">
                            {sortedAnimeList.map((anime) => (
                                <AnimeCard
                                    key={anime.id}
                                    anime={anime}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}