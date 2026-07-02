import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import PetDetail from "./pages/PetDetail";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminAdoptions from "./pages/AdminAdoptions";
import MyRequests from "./pages/MyRequests";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Navbar />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/pets/:id" element={<PetDetail />} />
              <Route path="/admin/adoptions" element={<AdminAdoptions />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/my-requests" element={<MyRequests />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </BrowserRouter>

        <ToastContainer />
        <Footer />
      </div>
    </AuthProvider>
  );
}
