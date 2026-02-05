import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function MyRequests() {
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchList() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/adoptions`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load");
        if (mounted) setList(data);
      } catch (err) {
        toast.error(err.message || "Failed to load requests");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchList();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Adoption Requests</h2>
      {list.length === 0 && (
        <div className="alert alert-warning">
          You have no adoption requests.
        </div>
      )}
      <div className="row g-3">
        {list.map((r) => (
          <div key={r._id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {r.pet?.name}{" "}
                  <span className="text-muted">({r.pet?.species})</span>
                </h5>
                <ul className="list-unstyled mb-2">
                  <li className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        r.status === "approved"
                          ? "bg-success"
                          : r.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {r.status}
                    </span>
                  </li>
                  {r.message && (
                    <li className="mb-1">
                      <strong>Message:</strong> {r.message}
                    </li>
                  )}
                  <li className="mb-1 text-muted small">
                    <strong>Submitted:</strong>{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </li>
                  <li className="text-muted small">
                    <strong>Updated:</strong>{" "}
                    {new Date(r.updatedAt).toLocaleString()}
                  </li>
                </ul>
                {r.mailPreview && (
                  <div className="mt-2">
                    <div className="alert alert-info mb-0 p-2">
                      <strong>Email preview:</strong>{" "}
                      <a href={r.mailPreview} target="_blank" rel="noreferrer">
                        View email preview
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
