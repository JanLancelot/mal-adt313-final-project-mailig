import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-brand">
                    AniList
                </Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <span className="navbar-username">Welcome, {user.username}</span>
                            <button onClick={logout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="navbar-link">Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};