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

  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
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
    </div>
  );
}
