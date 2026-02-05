import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddPetForm from "../components/AddPetForm";
import ReadMore from "../components/ReadMore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [filters, setFilters] = useState({
    species: "",
    minAge: "",
    maxAge: "",
    location: "",
  });
  const { user } = useAuth();

  const getFilteredPets = () => {
    return pets.filter((p) => {
      let matches = true;
      if (query) {
        const q = query.toLowerCase();
        matches =
          matches &&
          ((p.name || "").toLowerCase().includes(q) ||
            (p.species || "").toLowerCase().includes(q));
      }
      if (filters.species) {
        matches =
          matches &&
          (p.species || "")
            .toLowerCase()
            .includes(filters.species.toLowerCase());
      }
      if (filters.minAge && !isNaN(Number(filters.minAge))) {
        matches = matches && p.age >= Number(filters.minAge);
      }
      if (filters.maxAge && !isNaN(Number(filters.maxAge))) {
        matches = matches && p.age <= Number(filters.maxAge);
      }
      if (filters.location) {
        matches =
          matches &&
          (p.location || "")
            .toLowerCase()
            .includes(filters.location.toLowerCase());
      }
      return matches;
    });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/pets`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (mounted) setPets(data || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load pets");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [API_URL]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Pets</h2>

      {user && user.role === "admin" && (
        <AddPetForm onAdd={(newPet) => setPets((prev) => [newPet, ...prev])} />
      )}

      {loading && <div className="alert alert-info">Loading pets…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && pets.length === 0 && (
        <div className="alert alert-warning">No pets available.</div>
      )}

      {!loading && !error && pets.length > 0 && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search by name or species"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Species"
                    value={filters.species}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        species: e.target.value,
                      }));
                      setPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min Age"
                    value={filters.minAge}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        minAge: e.target.value,
                      }));
                      setPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Age"
                    value={filters.maxAge}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        maxAge: e.target.value,
                      }));
                      setPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }));
                      setPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {getFilteredPets()
              .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
              .map((p) => (
                <div key={p._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    {p.imageUrl && (
                      <img
                        src={
                          p.imageUrl.startsWith("http")
                            ? p.imageUrl
                            : `${API_URL}${p.imageUrl}`
                        }
                        alt={p.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link
                          to={`/pets/${p._id}`}
                          className="text-decoration-none"
                        >
                          {p.name}
                        </Link>
                      </h5>
                      <ul className="list-unstyled text-muted mb-2">
                        <li>
                          <strong>Species:</strong> {p.species || "—"}
                        </li>
                        <li>
                          <strong>Age:</strong> {p.age ?? "—"}
                        </li>
                        <li>
                          <strong>Location:</strong> {p.location || "—"}
                        </li>
                      </ul>
                      {p.description && (
                        <ReadMore
                          text={p.description}
                          maxChars={100}
                          className="card-text text-muted small"
                        />
                      )}
                      <Link
                        to={`/pets/${p._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                    {user && user.role === "admin" && (
                      <div className="card-footer bg-light">
                        <AdminControls
                          pet={p}
                          onUpdated={(updated) =>
                            setPets((prev) =>
                              prev.map((x) =>
                                x._id === updated._id ? updated : x
                              )
                            )
                          }
                          onDeleted={(id) =>
                            setPets((prev) => prev.filter((x) => x._id !== id))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <Pagination
            total={getFilteredPets().length}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

function Pagination({ total, page, pageSize, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages === 1) return null;
  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChange(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onChange(Math.min(pages, page + 1))}
            disabled={page === pages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

function AdminControls({ pet, onUpdated, onDeleted }) {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const { token } = require("../context/AuthContext").default ? {} : {};
  // we will read token from localStorage directly here to avoid circular imports
  const authToken = localStorage.getItem("token");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: pet.name || "",
    species: pet.species || "",
    age: pet.age || "",
    description: pet.description || "",
  });
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/pets/${pet._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");
      onUpdated(data);
      setEditing(false);
      toast.success("Pet updated successfully!");
    } catch (err) {
      toast.error(err.message || "Update error");
    } finally {
      setLoading(false);
    }
  }

  async function confirmRemove() {
    setConfirmOpen(false);
    try {
      const res = await fetch(`${API_URL}/api/pets/${pet._id}`, {
        method: "DELETE",
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Delete failed");
      onDeleted(pet._id);
      toast.success("Pet deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Delete error");
    }
  }

  return (
    <div>
      {editing ? (
        <div className="mt-2">
          <input
            className="form-control form-control-sm mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="form-control form-control-sm mb-2"
            value={form.species}
            onChange={(e) => setForm({ ...form, species: e.target.value })}
            placeholder="Species"
          />
          <input
            className="form-control form-control-sm mb-2"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Age"
          />
          <textarea
            className="form-control form-control-sm mb-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={save}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </button>
        </div>
      )}

      {confirmOpen && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete pet?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete "{pet.name}"? This action
                  cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmRemove}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
