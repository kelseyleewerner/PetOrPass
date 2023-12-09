import { Link, Route, Routes } from "react-router-dom";
import React from "react";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { PetGallery } from "./PetGallery";
import { ProtectedRoute } from "./ProtectedRoute";
import { RatePet } from "./RatePet";
import { SubmitPetForm } from "./SubmitPetForm";
import { useAuth } from "../services/AuthService";

export function NavMain(): JSX.Element {
  return (
    <>
      <NavBar />
      <NavRoutes />
    </>
  );
}

// Navigation bar is only displayed on the page if the user is logged in
function NavBar(): JSX.Element {
  const { isUserLoggedIn, isAuthReady } = useAuth();

  if (!isAuthReady()) {
    return <></>;
  }

  return <>{isUserLoggedIn() ? <NavView /> : <></>}</>;
}

function NavView(): JSX.Element {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top mb-5 primary-color">
      <div className="container-fluid">
        <div className="navbar-brand">Pet or Pass</div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}

function NavLinks(): JSX.Element {
  return (
    <ul className="navbar-nav me-auto mb-2 mb-md-0">
      <li className="nav-item">
        <Link to="/" className="nav-link active">
          Rate Pets
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/submit-pet" className="nav-link active">
          Submit Pet
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/view-pets" className="nav-link active">
          View Pets
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/logout" className="nav-link active">
          Logout
        </Link>
      </li>
    </ul>
  );
}

// Components wrapped in ProtectedRoute cannot be accessed via
// inputting a URL into the browser if then user is not logged in
function NavRoutes(): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RatePet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit-pet"
        element={
          <ProtectedRoute>
            <SubmitPetForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-pets"
        element={
          <ProtectedRoute>
            <PetGallery />
          </ProtectedRoute>
        }
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
