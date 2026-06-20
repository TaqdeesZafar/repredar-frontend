import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load every route so the homepage only downloads its own code.
// Other pages (dashboard, profile, report viewer, etc.) load on demand.
const Home           = lazy(() => import("./pages/Home"));
const SearchResult   = lazy(() => import("./pages/SearchResult"));
const ProfileDisplay = lazy(() => import("./pages/ProfileDisplay"));
const Login          = lazy(() => import("./pages/Login"));
const SignUp         = lazy(() => import("./pages/SignUp"));
const Dasboard       = lazy(() => import("./pages/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("./pages/ResetPassword"));
const Profile        = lazy(() => import("./pages/Profile"));
const ReportDownload = lazy(() => import("./pages/ReportDownload"));
const PrivacyPolicy  = lazy(() => import("./pages/Legal").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/Legal").then(m => ({ default: m.TermsOfService })));
const Blog           = lazy(() => import("./pages/Blog"));
const BlogPost       = lazy(() => import("./pages/BlogPost"));

// Lightweight fallback while a route chunk loads.
function RouteLoader() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: "var(--bg-page)",
    }}>
      <div style={{
        width: 40, height: 40, border: "3px solid var(--border)",
        borderTopColor: "var(--accent)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<RouteLoader />}>
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
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
