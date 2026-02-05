import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.msg || "Verification failed.");
        toast.success(data.msg || "Email verified!");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        setMessage("Verification failed.");
        toast.error("Verification failed.");
      })
      .finally(() => setLoading(false));
  }, [searchParams, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              <h2 className="card-title mb-4">Email Verification</h2>
              {loading ? (
                <div>
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">Verifying your email...</p>
                </div>
              ) : (
                <div className="alert alert-info">{message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
