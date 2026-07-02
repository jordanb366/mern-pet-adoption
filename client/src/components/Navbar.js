import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          🐾 Pet Adoption
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Primary navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pets">
                Browse Pets
              </Link>
            </li>

            {/* Admin Dropdown */}
            {user?.role === "admin" && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="adminDropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </button>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item" to="/admin/dashboard">
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/adoptions">
                      ✅ Adoptions
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* User section (right side) */}
          <ul className="navbar-nav">
            {user ? (
              <>
                {/* My Requests & Favorites - visible when logged in */}
                <li className="nav-item">
                  <Link className="nav-link" to="/my-requests">
                    📋 Requests
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites">
                    ❤️ Favorites
                  </Link>
                </li>

                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="userDropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {user.name}
                    <span className="badge bg-light text-dark ms-2">
                      {user.role}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={logout}
                        style={{ cursor: "pointer" }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
