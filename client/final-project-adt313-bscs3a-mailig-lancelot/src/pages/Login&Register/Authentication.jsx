import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authentication.css';

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = isLogin ? 'http://localhost/mal-project/login.php' : 'http://localhost/mal-project/register.php';
      
      try {
        const response = await axios.post(url, { username, password });
        setMessage(response.data.message);
        console.log(message);
        
        if (isLogin && response.data.message === "Login successful") {
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/home');
        }
        if (!isLogin && response.data.message === "User registered successfully") {
          setIsLogin(!isLogin)
      }
      } catch (error) {
        setMessage(error, 'An error occurred. Please try again.');
      }
    };

    return (
      <div className="auth-container">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="switch-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="switch-link">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
        {message && <p className="auth-message">{message}</p>}
      </div>
    );
}
