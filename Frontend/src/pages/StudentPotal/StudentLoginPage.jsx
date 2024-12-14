import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLoginPage = () => {
  const [institutionId, setInstitutionId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  //   console.log(import.meta.env.VITE_BACKEND_URL)

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add login logic here (e.g., API call)
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/student/login`,
      {
        institutionId: institutionId,
        password: password,
      }
    );

    const token = res.headers["x-auth-token"];
    console.log(res)
    if (token) {
      // Store token in localStorage or sessionStorage
      localStorage.setItem("authToken", token);

      if (res.data.userRole === "student") {
        localStorage.setItem("userRole", "student"); // Store the user role
      }

      navigate("/student");
    } else {
      alert("Login failed: No token received.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="instituteId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Institute ID
            </label>
            <input
              type="text"
              id="instituteId"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Institute ID"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/student/login" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentLoginPage;
