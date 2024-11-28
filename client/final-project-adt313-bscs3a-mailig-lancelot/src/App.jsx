import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddAnime from "./pages/AddAnime/AddAnime";
import Authentication from "./pages/Login&Register/Authentication";
import AnimeDetails from "./pages/AnimeDetails/AnimeDetails";
import "./App.css";
import axios from "axios";
import { AuthProvider } from "./AuthContext";
import Navbar from "./pages/Navbar/Navbar";

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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/add-anime"
            element={<AddAnime onAddAnime={handleAddAnime} />}
          />
          <Route path="/anime/:animeId" element={<AnimeDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;