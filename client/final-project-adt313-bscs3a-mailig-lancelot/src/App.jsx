import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddAnime from "./pages/AddAnime/AddAnime";
import Authentication from "./pages/Login&Register/Authentication";
import AnimeDetails from "./pages/AnimeDetails/AnimeDetails";
import "./App.css";
import axios from "axios";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./pages/Navbar/Navbar";
import { AnimeProvider } from "./AnimeContext";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const handleAddAnime = async (newAnime) => {
    try {
      await axios.post(
        "http://localhost/mal-project/anime_operations.php",
        newAnime
      );
    } catch (err) {
      console.error("Failed to add anime", err);
    }
  };

  return (
    <AuthProvider>
      <AnimeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Authentication />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-anime"
              element={
                <ProtectedRoute>
                  <AddAnime onAddAnime={handleAddAnime} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/anime/:animeId"
              element={
                <ProtectedRoute>
                  <AnimeDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AnimeProvider>
    </AuthProvider>
  );
}

export default App;