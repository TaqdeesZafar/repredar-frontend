import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ success: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) {
      setStatus({ success: false, message: "Passwords do not match" });
      return;
    }

    if (!token || !password) {
      setStatus({ success: false, message: "Token and password are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to reset password");

      setStatus({ success: true, message: "Password updated! Redirecting..." });
      setTimeout(() => navigate("/login"), 2000); // ✅ Redirect after success
    } catch (err) {
      setStatus({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="text"
          placeholder="Enter your reset token"
          className="w-full p-2 border rounded mb-4"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-2 border rounded mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {status.message && (
          <p
            className={`mt-4 text-center ${
              status.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
