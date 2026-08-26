import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
      toast.error("Access denied. Admin only.");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          toast.error(data.msg || "Failed to load stats");
        }
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token, API_URL]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!stats) return <div className="container mt-4">Failed to load data</div>;

  // Format date for display
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>

      {/* Top Stats Row */}
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Adoptions</h5>
              <p className="card-text fs-3">{stats.totalAdoptions}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pending Requests</h5>
              <p className="card-text fs-3">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Popular Pets */}
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Most Popular Pets</h5>
              {stats.mostPopularPets && stats.mostPopularPets.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.mostPopularPets.map((pet, idx) => (
                    <li
                      key={pet.petId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {idx + 1}. {pet.petName}
                      </span>
                      <span className="badge bg-primary rounded-pill">
                        {pet.requestCount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No adoption requests yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Signups (Last 7 Days)</h5>
              <p className="card-text mb-3">
                <span className="fs-5 fw-bold text-primary">
                  {stats.recentSignups.count}
                </span>
                <span className="text-muted ms-2">new users</span>
              </p>
              {stats.recentSignups.users &&
              stats.recentSignups.users.length > 0 ? (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSignups.users.map((user) => (
                        <tr key={user._id}>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "80px" }}
                          >
                            {user.name}
                          </td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "120px" }}
                          >
                            {user.email}
                          </td>
                          <td className="text-nowrap">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No new signups in the last 7 days</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
