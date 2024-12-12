import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();  // Replace useHistory with useNavigate

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      // Redirect to login if no token or not an admin
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AdminProtectedRoute;
