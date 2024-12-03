import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import MessDetailsPage from "./pages/MessDetailsPage";
import AdminProtectedRoute from "./Auth/AdminProtectedRoute"; // Import the Protected Route

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Route for MessDetailsPage */}
        <Route 
          path="/home" 
          element={
            <AdminProtectedRoute>
              <MessDetailsPage />
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
