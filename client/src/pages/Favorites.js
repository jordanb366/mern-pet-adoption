import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const { token } = useAuth();

  // Fetch favorites on mount
  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view favorites");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFavorites(data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load favorites");
      })
      .finally(() => setLoading(false));
  }, [token, API_URL]);

  // Remove from favorites
  const handleRemoveFavorite = (petId) => {
    fetch(`${API_URL}/api/favorites/${petId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => {
        setFavorites((prev) => prev.filter((pet) => pet._id !== petId));
        toast.success("Removed from favorites");
      })
      .catch((err) => {
        toast.error("Failed to remove from favorites");
        console.error(err);
      });
  };

  if (loading) return <div className="container mt-4">Loading favorites…</div>;
  if (error)
    return <div className="container mt-4 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Favorite Pets</h2>

      {favorites.length === 0 ? (
        <div className="alert alert-info">
          No favorites yet. <Link to="/pets">Browse pets</Link> to add some!
        </div>
      ) : (
        <div className="row g-3">
          {favorites.map((pet) => (
            <div key={pet._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {pet.imageUrl && (
                  <img
                    src={
                      pet.imageUrl.startsWith("http")
                        ? pet.imageUrl
                        : `${API_URL}${pet.imageUrl}`
                    }
                    alt={pet.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <p className="card-text text-muted">{pet.species}</p>
                  <p className="card-text">Age: {pet.age} years</p>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/pets/${pet._id}`}
                      className="btn btn-primary btn-sm flex-grow-1"
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveFavorite(pet._id)}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
