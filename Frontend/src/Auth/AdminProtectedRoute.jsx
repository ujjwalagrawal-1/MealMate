import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();  

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "Warden") {
      // Redirect to login if no token or not an admin
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AdminProtectedRoute;
