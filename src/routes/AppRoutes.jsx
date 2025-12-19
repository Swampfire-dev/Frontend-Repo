import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "../layouts/ProtectedLayout";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Training from "../pages/Training/Training";
import Partner from "../pages/Partner/Partner";
import Certification from "../pages/Certification/Certification";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Protected routes wrapped in ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/training" element={<Training />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/certification" element={<Certification />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}
