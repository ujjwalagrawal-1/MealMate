import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import MessPage from "./pages/MessDetailsPage";
import AdminProtectedRoute from "./Auth/AdminProtectedRoute"; // Import the Protected Route
import { MessProvider } from "./context/MessContext";
function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Route for MessDetailsPage */}
        <Route
          path="/mess"
          element={
            <AdminProtectedRoute>
              <MessProvider>
                <MessPage />
              </MessProvider>
            </AdminProtectedRoute>
          }
        />
        {/* Login page route */}
        <Route path="/login" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
