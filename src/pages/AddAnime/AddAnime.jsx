import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = "2c7e4cf1a9c1270547b2397569f7ad40";
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/tv';

const AnimeForm = ({ anime, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(anime ? anime.title : '');
    const [score, setScore] = useState(anime ? anime.score : '');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ id: anime ? anime.id : null, title, score: parseFloat(score) });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="score">Score</label>
          <input
            id="score"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>
        <div className="flex">
          <button type="submit" className="bg-blue">
            {anime ? 'Update' : 'Add'} Anime
          </button>
          <button type="button" onClick={onCancel} className="bg-gray">
            Cancel
          </button>
        </div>
      </form>
    );
  };
  
  AnimeForm.propTypes = {
    anime: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      score: PropTypes.number,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

const AddAnime = ({ onAddAnime }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(TMDB_SEARCH_URL, {
          params: {
            api_key: TMDB_API_KEY,
            query: searchQuery,
          },
        });
        setSearchResults(response.data.results);
      } catch (err) {
        setError(err, 'Failed to search anime');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleAddAnimeFromSearch = (tmdbAnime) => {
      const newAnime = {
        title: tmdbAnime.name,
        score: tmdbAnime.vote_average,
      };
      onAddAnime(newAnime);
      navigate('/home');
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
    return (
        <div className="container">
            <h1>Add Anime</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch} className="bg-blue">Search</button>
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    <h2>Search Results</h2>
                    <ul>
                        {searchResults.map((result) => (
                            <li key={result.id}>
                                {result.name} ({result.first_air_date ? result.first_air_date.substring(0,4) : "N/A"})
                                <button onClick={() => handleAddAnimeFromSearch(result)} className="bg-green">Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <AnimeForm onSubmit={onAddAnime} onCancel={() => navigate('/home')} />
        </div>
    );
};

AddAnime.propTypes = {
    onAddAnime: PropTypes.func.isRequired,
};

export default AddAnime;