import React from "react";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer bg-light border-top">
      <div className="container py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">© {year} Pet Adoption</div>
          <div className="text-muted small">Built with ❤️</div>
        </div>
      </div>
    </footer>
  );
}
