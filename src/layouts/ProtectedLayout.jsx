
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
