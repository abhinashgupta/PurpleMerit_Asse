import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage"; 
import SimulationPage from "./pages/SimulationPage"; 
import ManagementPage from "./pages/ManagementPage"; 
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/manage/:entity" element={<ManagementPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
