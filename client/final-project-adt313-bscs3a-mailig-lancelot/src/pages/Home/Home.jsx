import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Home.css';

const AnimeCard = ({ anime, onUpdate, onDelete }) => (
  <div className="card">
    <h2>{anime.title}</h2>
    <p>
      Score: <span>{anime.score}</span>
    </p>
    <div>
      <button onClick={() => onUpdate(anime)} className="bg-blue">
        Update
      </button>
      <button onClick={() => onDelete(anime.id)} className="bg-red">
        Delete
      </button>
    </div>
  </div>
);

AnimeCard.propTypes = {
  anime: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

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

const Home = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);
  const navigate = useNavigate();

  const fetchAnime = async () => {
    try {
      const response = await axios.get('http://localhost/mal-project/anime_operations.php');
      setAnimeList(response.data);
      setLoading(false);
    } catch (err) {
      setError(err, 'Failed to fetch anime list');
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    fetchAnime();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAdd = async (newAnime) => {
    try {
      await axios.post('http://localhost/mal-project/anime_operations.php', newAnime);
      setIsAdding(false);
      fetchAnime();
    } catch (err) {
      setError(err, 'Failed to add anime');
    }
  };

  const handleUpdate = async (updatedAnime) => {
    try {
      await axios.put('http://localhost/mal-project/anime_operations.php', updatedAnime);
      setEditingAnime(null);
      fetchAnime();
    } catch (err) {
      setError(err, 'Failed to update anime');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this anime?')) {
      try {
        await axios.delete('http://localhost/mal-project/anime_operations.php', { data: { id } });
        fetchAnime();
      } catch (err) {
        setError(err, 'Failed to delete anime');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="flex">
        <h1>Anime List</h1>
        <div>
          <button onClick={() => setIsAdding(true)} className="bg-green">
            Add Anime
          </button>
          <button onClick={handleLogout} className="bg-red">
            Logout
          </button>
        </div>
      </div>

      {isAdding && (
        <AnimeForm onSubmit={handleAdd} onCancel={() => setIsAdding(false)} />
      )}

      {editingAnime && (
        <AnimeForm
          anime={editingAnime}
          onSubmit={handleUpdate}
          onCancel={() => setEditingAnime(null)}
        />
      )}

      <div className="grid">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            onUpdate={setEditingAnime}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
