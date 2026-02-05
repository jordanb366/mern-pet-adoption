import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ReadMore from "../components/ReadMore";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const { user, token } = useAuth();
  const [requestOpen, setRequestOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/pets/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch(() => {});
  }, [id]);

  if (!pet) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="row g-0">
              {pet.imageUrl && (
                <div className="col-md-5">
                  <img
                    src={
                      pet.imageUrl.startsWith("http")
                        ? pet.imageUrl
                        : `${API_URL}${pet.imageUrl}`
                    }
                    alt={pet.name}
                    className="img-fluid rounded-start"
                    style={{
                      height: "100%",
                      objectFit: "cover",
                      minHeight: "300px",
                    }}
                  />
                </div>
              )}
              <div className={pet.imageUrl ? "col-md-7" : "col-12"}>
                <div className="card-body">
                  <h2 className="card-title mb-3">{pet.name}</h2>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item">
                      <strong>Species:</strong> {pet.species}
                    </li>
                    <li className="list-group-item">
                      <strong>Age:</strong> {pet.age} years old
                    </li>
                    {pet.location && (
                      <li className="list-group-item">
                        <strong>Location:</strong> {pet.location}
                      </li>
                    )}
                  </ul>
                  {pet.description && (
                    <ReadMore
                      text={pet.description}
                      maxChars={120}
                      className="card-text"
                    />
                  )}
                  {user && user.role !== "admin" && (
                    <button
                      className="btn btn-primary btn-lg w-100 mt-3"
                      onClick={() => setRequestOpen(true)}
                    >
                      Request Adoption
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {requestOpen && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Adoption: {pet.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRequestOpen(false)}
                  disabled={sending}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="adoptionMessage" className="form-label">
                  Message to the shelter (optional)
                </label>
                <textarea
                  id="adoptionMessage"
                  className="form-control"
                  placeholder="Tell us why you'd be a great fit for this pet..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRequestOpen(false)}
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    setSending(true);
                    try {
                      const res = await fetch(`${API_URL}/api/adoptions`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                        },
                        body: JSON.stringify({ petId: pet._id, message }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        toast.error(data.msg || "Failed to submit request");
                      } else {
                        toast.success("Adoption request submitted");
                        setRequestOpen(false);
                        setMessage("");
                      }
                    } catch (err) {
                      toast.error(err.message || "Network error");
                    } finally {
                      setSending(false);
                    }
                  }}
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
