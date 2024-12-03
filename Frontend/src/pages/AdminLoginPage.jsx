import React from "react";
import axios from "axios";

const AdminLoginPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const [email, password, rememberMe] = e.target.elements;

    try {
      const res = await axios.post("http://localhost:3000/api/admin/login", {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.checked,
      });
      console.log(res.data.result.userRole)
      const token = res.headers["x-auth-token"];
      if (token) {
        // Store token in localStorage or sessionStorage
        localStorage.setItem("authToken", token);

        if (res.data.result.userRole === "admin") {
          localStorage.setItem("userRole", "admin"); // Store the user role
        }

        alert("Login successful!");
      } else {
        alert("Login failed: No token received.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Login</h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-700"
                  >
                    E-Mail Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    name="email"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-700"
                  >
                    Password
                  </label>
                  <div className="flex justify-between">
                    <input
                      id="password"
                      type="password"
                      className="mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      name="password"
                      required
                    />
                    <a
                      href="/forgot"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Remember Me
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-100 p-4 text-center rounded-b-lg">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Create One
                </a>
              </p>
            </div>
          </div>
          <div className="text-center mt-5 text-gray-500 text-sm">
            Copyright &copy; 2017-2021 &mdash; Your Company
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
