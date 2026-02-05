import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mailPreview, setMailPreview] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.msg || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        toast.success(
          data.msg ||
            "Registration successful. Please check your email to verify your account."
        );
        // show preview link in UI when available and let user navigate to login
        if (data.mailPreview) setMailPreview(data.mailPreview);
        setRegistered(true);
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {registered && (
                  <div className="alert alert-success">
                    Registration successful. Please check your email to verify
                    your account.
                    {mailPreview && (
                      <div className="mt-2">
                        <a href={mailPreview} target="_blank" rel="noreferrer">
                          View email preview
                        </a>
                      </div>
                    )}
                    <div className="mt-2">
                      <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/login")}
                      >
                        Go to Login
                      </button>
                    </div>
                  </div>
                )}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating…" : "Create account"}
                  </button>
                </div>
                <div className="text-center text-muted">
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
