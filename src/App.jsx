import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SearchResult from "./pages/SearchResult";
import Home from "./pages/Home";
import ProfileDisplay from "./pages/ProfileDisplay";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dasboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ReportDownload from "./pages/ReportDownload";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/profile" element={<ProfileDisplay />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dasboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile-info"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/subscriptions" element={<Navigate to="/" replace />} />
          <Route path="/report/:token" element={<ReportDownload />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
