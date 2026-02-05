import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";

export default function AdminAdoptions() {
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/adoptions`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to load");
      setList(data);
    } catch (err) {
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // intentionally left blank
  }, []);

  function promptAction(id, status) {
    setConfirmAction({ id, status });
    setConfirmOpen(true);
  }

  async function runConfirmedAction() {
    if (!confirmAction) return;
    const { id, status } = confirmAction;
    setConfirmOpen(false);
    try {
      const res = await fetch(`${API_URL}/api/adoptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Update failed");
      toast.success(`Request ${status}`);
      setList((prev) => prev.map((r) => (r._id === id ? data : r)));
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setConfirmAction(null);
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Adoption Requests</h2>
      {list.length === 0 && (
        <div className="alert alert-warning">No requests yet.</div>
      )}
      <div className="row g-3">
        {list.map((r) => (
          <div key={r._id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5 className="card-title">
                      {r.pet?.name}{" "}
                      <span className="text-muted">({r.pet?.species})</span>
                    </h5>
                    <ul className="list-unstyled mb-2">
                      <li className="mb-1">
                        <strong>Requested by:</strong> {r.user?.name} (
                        {r.user?.email})
                      </li>
                      {r.message && (
                        <li className="mb-1">
                          <strong>Message:</strong> {r.message}
                        </li>
                      )}
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
                    </ul>
                  </div>
                  <div className="col-md-4 d-flex align-items-center justify-content-end gap-2">
                    <button
                      className="btn btn-success"
                      disabled={r.status === "approved"}
                      onClick={() => promptAction(r._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={r.status === "rejected"}
                      onClick={() => promptAction(r._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {r.mailPreview && (
                  <div className="mt-3">
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

      <ConfirmationModal
        open={confirmOpen}
        title={
          confirmAction
            ? `${
                confirmAction.status === "approved" ? "Approve" : "Reject"
              } request?`
            : "Confirm"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${confirmAction.status} this adoption request?`
            : ""
        }
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={runConfirmedAction}
        confirmText={
          confirmAction?.status === "approved" ? "Approve" : "Reject"
        }
      />
    </div>
  );
}
