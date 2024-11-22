import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Authentication.css';

export default function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost/mal-project/login.php' : 'http://localhost/mal-project/register.php';

        try {
            const data = isLogin
                ? { username, password }
                : { username, password, firstName, lastName, middleName, contactNo, role };

            const response = await axios.post(url, data);
            setMessage(response.data.message);

            if (isLogin && response.data.message === "Login successful") {
                localStorage.setItem('user', JSON.stringify({ username }));
                navigate('/home');
            }
            if (!isLogin && response.data.message === "User registered successfully") {
                setIsLogin(true);
                setUsername('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setMiddleName('');
                setContactNo('');
                setRole('user');
            }
        } catch (error) {
          if (error.response) {
            setMessage(error.response.data.message || 'An error occurred. Please try again.');
            console.error('Server responded with:', error.response.data);
          } else if (error.request) {
            setMessage('No response from server. Please try again later.');
            console.error('No response from server:', error.request);
          } else {
            setMessage('An error occurred. Please try again.');
            console.error('Error during request setup:', error.message);
          }
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
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName">Middle Name:</label>
                            <input
                                type="text"
                                id="middleName"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactNo">Contact Number:</label>
                            <input
                                type="text"
                                id="contactNo"
                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role:</label>
                            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </>
                )}
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