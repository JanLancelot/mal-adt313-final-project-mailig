import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    const getInitials = (username) => {
        return username.charAt(0);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-brand">
                    AniList
                </Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/user-profile" className="user-profile-link">
                                <div className="profile-icon">
                                    {getInitials(user.username)}
                                </div>
                                <span className="navbar-username">{user.username}</span>
                            </Link>
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
}