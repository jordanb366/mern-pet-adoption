import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function AddPetForm({ onAdd }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("species", species);
      formData.append("age", age);
      formData.append("description", description);
      if (file) formData.append("image", file);

      const res = await fetch(`${API_URL}/api/pets`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.msg || data.error || "Failed to add pet";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        setName("");
        setSpecies("");
        setAge("");
        setDescription("");
        setFile(null);
        onAdd && onAdd(data);
        toast.success("Pet added successfully!");
      }
    } catch (err) {
      const errorMsg = err.message || "Network error";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-3">Add a Pet</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="petName" className="form-label">
                Name *
              </label>
              <input
                id="petName"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pet's name"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="petSpecies" className="form-label">
                Species
              </label>
              <input
                id="petSpecies"
                type="text"
                className="form-control"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="Dog, Cat, etc."
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="petAge" className="form-label">
                Age
              </label>
              <input
                id="petAge"
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
              />
            </div>
            <div className="col-12">
              <label htmlFor="petDescription" className="form-label">
                Description
              </label>
              <textarea
                id="petDescription"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about this pet..."
                rows="3"
              />
            </div>
            <div className="col-12">
              <label htmlFor="petImage" className="form-label">
                Image
              </label>
              <input
                id="petImage"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            {file && (
              <div className="col-12">
                <label className="form-label">Preview:</label>
                <div>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </div>
            )}
            {error && (
              <div className="col-12">
                <div className="alert alert-danger">{error}</div>
              </div>
            )}
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Pet"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
