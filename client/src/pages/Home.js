import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <h1 className="display-4 mb-4">Welcome to Pet Adoption</h1>
          <p className="lead mb-4">
            Find your perfect companion! Browse our adorable pets waiting for
            their forever homes.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Link to="/pets" className="btn btn-primary btn-lg px-4 me-md-2">
              Browse Pets
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3">🐕</div>
              <h5 className="card-title">Find Your Friend</h5>
              <p className="card-text">
                Browse through hundreds of adorable pets looking for loving
                homes.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3">❤️</div>
              <h5 className="card-title">Easy Adoption</h5>
              <p className="card-text">
                Submit adoption requests online and connect with shelters
                directly.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-4 mb-3">🏠</div>
              <h5 className="card-title">Forever Homes</h5>
              <p className="card-text">
                Give a pet a second chance at happiness in a loving home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
