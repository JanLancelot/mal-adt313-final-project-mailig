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
                <a href="/home" className="navbar-brand">
                    AniList
                </a>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <a href="/user-profile" className="user-profile-link">
                                <div className="profile-icon">
                                    {getInitials(user.username)}
                                </div>
                                <span className="navbar-username">{user.username}</span>
                            </a>
                            <button onClick={logout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <a href="/" className="navbar-link">Login</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
