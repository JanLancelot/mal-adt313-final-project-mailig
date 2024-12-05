import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateAnime.css";
import { useAnime } from "../../AnimeContext";
import axios from "axios";

const API_BASE_URL = "http://localhost/mal-project/";

const animeAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "anime_operations.php",
  timeout: 5000,
});

const castAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "cast_operations.php",
  timeout: 5000,
});

const crewAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "crew_operations.php",
  timeout: 5000,
});

const photosAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "photos_operations.php",
  timeout: 5000,
});

const videosAxiosInstance = axios.create({
  baseURL: API_BASE_URL + "videos_operations.php",
  timeout: 5000,
});

function AnimeForm({ anime, cast, crew, photos, videos, onSubmit, onCancel }) {
  const [title, setTitle] = useState(anime.title || "");
  const [score, setScore] = useState(anime.score || "");
  const [synopsis, setSynopsis] = useState(anime.synopsis || "");
  const [coverPhoto, setCoverPhoto] = useState(anime.coverPhoto || "");
  const [popularity, setPopularity] = useState(anime.popularity || "");
  const [releaseDate, setReleaseDate] = useState(anime.releaseDate || "");
  const [genres, setGenres] = useState(
    anime.genres ? JSON.parse(anime.genres) : []
  );

  const [localCast, setLocalCast] = useState(cast);
  const [localCrew, setLocalCrew] = useState(crew);
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [localVideos, setLocalVideos] = useState(videos);
  const navigate = useNavigate();

  console.log("Genres: ", typeof genres);

  const handleDelete = async (endpoint, animeId) => {
    console.log(
      `Sending DELETE request to ${endpoint.defaults.baseURL} with anime_id: ${animeId}`
    );
    try {
      await endpoint.delete("", { data: { anime_id: animeId } });
      return true;
    } catch (error) {
      console.error(`Error deleting from ${endpoint.defaults.baseURL}:`, error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedScore = parseFloat(parseFloat(score).toFixed(3)) || 0;
    const animeData = {
      tmdb_id: anime.tmdb_id || null,
      title,
      score: formattedScore,
      synopsis,
      coverPhoto,
      popularity: parseFloat(popularity) || 0,
      releaseDate,
      genres: JSON.stringify(genres),
      id: anime.id,
    };

    try {
      await animeAxiosInstance.put("", animeData);

      const deletePromises = [
        handleDelete(castAxiosInstance, anime.id),
        handleDelete(crewAxiosInstance, anime.id),
        handleDelete(photosAxiosInstance, anime.id),
        handleDelete(videosAxiosInstance, anime.id),
      ];
      await Promise.all(deletePromises);

      const postPromises = [
        ...localCast.map((castMember) => {
          const castData = { ...castMember, anime_id: anime.id };
          return castAxiosInstance.post("", {
            data: castData,
            anime_id: anime.id,
          });
        }),
        ...localCrew.map((crewMember) => {
          const crewData = { ...crewMember, anime_id: anime.id };
          return crewAxiosInstance.post("", {
            data: crewData,
            anime_id: anime.id,
          });
        }),

        ...localPhotos.map((photo) => {
          return photosAxiosInstance.post("", {
            data: photo.url,
            anime_id: anime.id,
          });
        }),
        ...localVideos.map((video) => {
          const videoData = { ...video, anime_id: anime.id };
          return videosAxiosInstance.post("", {
            data: videoData,
            anime_id: anime.id,
          });
        }),
      ];

      const results = await Promise.all(postPromises);
      const newCast = results
        .slice(0, localCast.length)
        .map((res, index) => ({ ...localCast[index], id: res.data.id }));
      const newCrew = results
        .slice(localCast.length, localCast.length + localCrew.length)
        .map((res, index) => ({ ...localCrew[index], id: res.data.id }));

      onSubmit(animeData, newCast, newCrew, localPhotos, localVideos);
      navigate("/home");
    } catch (error) {
      console.error("Error updating anime:", error);
    }
  };

  useEffect(() => {
    if (anime) {
      setTitle(anime.title || "");
      setScore(anime.score || "");
      setSynopsis(anime.synopsis || "");
      setCoverPhoto(anime.coverPhoto || "");
      setPopularity(anime.popularity || "");
      setReleaseDate(anime.releaseDate || "");
      setGenres(
        anime.genres
          ? Array.isArray(anime.genres)
            ? anime.genres
            : JSON.parse(anime.genres)
          : []
      );
    }
    setLocalCast(cast);
    setLocalCrew(crew);
    setLocalPhotos(photos);
    setLocalVideos(videos);
  }, [anime, cast, crew, photos, videos]);

  const handleRemoveItem = (array, setArray, index) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...localVideos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setLocalVideos(newVideos);
  };

  const handlePhotoChange = (index, value) => {
    const newPhotos = [...localPhotos];
    newPhotos[index] = { url: value };
    setLocalPhotos(newPhotos);
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...localCast];
    newCast[index] = { ...newCast[index], [field]: value };
    setLocalCast(newCast);
  };

  const handleCrewChange = (index, field, value) => {
    const newCrew = [...localCrew];
    newCrew[index] = { ...newCrew[index], [field]: value };
    setLocalCrew(newCrew);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="anime-form">
        <div className="form-section main-info">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Enter anime title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="score">Score</label>
              <input
                id="score"
                type="number"
                step="0.001"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="popularity">Popularity</label>
              <input
                id="popularity"
                type="number"
                value={popularity}
                readOnly
                className="input-field readonly"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="synopsis">Synopsis</label>
            <textarea
              id="synopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              required
              className="input-field textarea"
              placeholder="Enter anime synopsis"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                id="releaseDate"
                type="date"
                value={releaseDate}
                readOnly
                className="input-field readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Genres</label>
              <input
                id="genres"
                type="text"
                value={genres}
                readOnly
                className="input-field readonly"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverPhoto">Cover Photo URL</label>
            <input
              id="coverPhoto"
              type="url"
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              required
              className="input-field"
              placeholder="Enter cover photo URL"
            />
            {coverPhoto && (
              <div className="cover-photo-preview">
                <img
                  src={coverPhoto}
                  alt="Cover Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Videos</h2>
          <div className="videos-grid">
            {localVideos.map((video, index) => (
              <div key={index} className="video-item">
                {video.key && (
                  <div className="video-frame">
                    <iframe
                      width="100%"
                      height="225"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name || video.key}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <div className="video-controls">
                  <input
                    type="text"
                    value={video.name || ""}
                    onChange={(e) =>
                      handleVideoChange(index, "name", e.target.value)
                    }
                    className="input-field"
                    placeholder="Video name"
                  />
                  <input
                    type="text"
                    value={video.key || ""}
                    onChange={(e) =>
                      handleVideoChange(index, "key", e.target.value)
                    }
                    className="input-field"
                    placeholder="YouTube ID"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(localVideos, setLocalVideos, index)
                    }
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setLocalVideos([...localVideos, { name: "", key: "" }])
            }
            className="add-button"
          >
            Add Video
          </button>
        </div>

        <div className="form-section">
          <h2>Photos</h2>
          <div className="photos-grid">
            {localPhotos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img
                  src={photo.url}
                  alt={`Photo ${index}`}
                  className="photo-preview"
                />
                <div className="photo-controls">
                  <input
                    type="url"
                    value={photo.url}
                    onChange={(e) => handlePhotoChange(index, e.target.value)}
                    className="input-field"
                    placeholder="Enter Photo URL"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveItem(localPhotos, setLocalPhotos, index)
                    }
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLocalPhotos([...localPhotos, { url: "" }])}
            className="add-button"
          >
            Add Photo
          </button>
        </div>

        <div className="form-section">
          <h2>Cast & Crew</h2>
          <div className="cast-crew-container">
            <div className="cast-section">
              <h3>Cast</h3>
              <div className="cast-grid">
                {localCast.map((castMember, index) => (
                  <div key={index} className="cast-crew-item">
                    <div className="profile-image-container">
                      {castMember.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`}
                          alt={castMember.name}
                          className="profile-image"
                        />
                      )}
                    </div>
                    <div className="cast-crew-inputs">
                      <input
                        type="text"
                        value={castMember.name}
                        onChange={(e) =>
                          handleCastChange(index, "name", e.target.value)
                        }
                        className="input-field"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={castMember.character}
                        onChange={(e) =>
                          handleCastChange(index, "character", e.target.value)
                        }
                        className="input-field"
                        placeholder="Character"
                      />
                      <input
                        type="text"
                        value={castMember.profile_path || ""}
                        onChange={(e) =>
                          handleCastChange(
                            index,
                            "profile_path",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="Profile Image URL"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(localCast, setLocalCast, index)
                        }
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalCast([
                    ...localCast,
                    { name: "", character: "", profile_path: "" },
                  ])
                }
                className="add-button"
              >
                Add Cast Member
              </button>
            </div>

            <div className="crew-section">
              <h3>Crew</h3>
              <div className="crew-grid">
                {localCrew.map((crewMember, index) => (
                  <div key={index} className="cast-crew-item">
                    <div className="profile-image-container">
                      {crewMember.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/original${crewMember.profile_path}`}
                          alt={crewMember.name}
                          className="profile-image"
                        />
                      )}
                    </div>
                    <div className="cast-crew-inputs">
                      <input
                        type="text"
                        value={crewMember.name}
                        onChange={(e) =>
                          handleCrewChange(index, "name", e.target.value)
                        }
                        className="input-field"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={crewMember.job}
                        onChange={(e) =>
                          handleCrewChange(index, "job", e.target.value)
                        }
                        className="input-field"
                        placeholder="Job"
                      />
                      <input
                        type="text"
                        value={crewMember.profile_path || ""}
                        onChange={(e) =>
                          handleCrewChange(
                            index,
                            "profile_path",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="Profile Image URL"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveItem(localCrew, setLocalCrew, index)
                        }
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalCrew([
                    ...localCrew,
                    { name: "", job: "", profile_path: "" },
                  ])
                }
                className="add-button"
              >
                Add Crew Member
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Anime
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

AnimeForm.propTypes = {
  anime: PropTypes.object,
  cast: PropTypes.array,
  crew: PropTypes.array,
  photos: PropTypes.array,
  videos: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default function UpdateAnime() {
  const { animeList, animeCasts, animeCrews, animePhotos, animeVideos } =
    useAnime();
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const numericId = parseInt(id);

    if (animeList.length > 0) {
      const foundAnime = animeList.find((anime) => anime.id === numericId);
      if (foundAnime) {
        setAnime(foundAnime);
        setCast(animeCasts[numericId] || []);
        setCrew(animeCrews[numericId] || []);
        setPhotos(animePhotos[numericId] || []);
        setVideos(animeVideos[numericId] || []);
      } else {
        setError("Anime not found in context.");
      }
      setLoading(false);
    }
  }, [id, animeList, animeCasts, animeCrews, animePhotos, animeVideos]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!anime) return <div>Anime not found.</div>;

  const handleFormSubmit = async () => {
    try {
      navigate("/home");
    } catch (error) {
      console.error("Error updating anime:", error);
      setError("Failed to update anime. Please try again later.");
    }
  };

  return (
    <div className="update-anime-container">
      <h1>Update Anime</h1>
      <AnimeForm
        anime={anime}
        cast={cast}
        crew={crew}
        photos={photos}
        videos={videos}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate("/home")}
      />
    </div>
  );
}
