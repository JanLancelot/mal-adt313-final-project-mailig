import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import AddAnime from "./pages/AddAnime/AddAnime";
import Authentication from "./pages/Login&Register/Authentication";
import AnimeDetails from "./pages/AnimeDetails/AnimeDetails";
import UserProfile from "./pages/UserPage/UserProfile";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./pages/Navbar/Navbar";
import { AnimeProvider } from "./AnimeContext";
import PropTypes from "prop-types";
import UpdateAnime from "./pages/UpdateAnime/UpdateAnime";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }
  if (!user || !user.role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

function App() {
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
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddAnime />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UpdateAnime />
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
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Router>
      </AnimeProvider>
    </AuthProvider>
  );
}

export default App;
