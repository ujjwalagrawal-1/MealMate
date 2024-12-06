import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import MessPage from "./pages/MessDetailsPage";
import MessHomePage from "./pages/MessHomePage.jsx";
import AdminProtectedRoute from "./Auth/AdminProtectedRoute"; // Import the Protected Route
import { MessProvider } from "./context/MessContext";
function App() {
  return (
    <Router>
      <MessProvider>
        <Routes>
          {/* Protected Route for MessDetailsPage */}
          <Route
            path="/mess"
            element={
              <AdminProtectedRoute>
                <MessPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/mess/:id"
            element={
              <AdminProtectedRoute>
                <MessHomePage />
              </AdminProtectedRoute>
            }
          />
          {/* Login page route */}
          <Route path="/login" element={<AdminLoginPage />} />
        </Routes>
      </MessProvider>
    </Router>
  );
}

export default App;
