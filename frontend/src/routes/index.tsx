import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import AdminDashboard from "../pages/admin/Dashboard";
import Shop from "../pages/public/Shop";
import ProtectedRoute from "../components/security/ProtectedRoute";
import AdminRoute from "../components/security/AdminRoute";
import Login from "../pages/auth/Login";
import CreateAccount from "../pages/auth/CreateAccount";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/shop" element={<Shop /> } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}