import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../App";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";

export default function SignIn() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();

  const from =
    typeof location.state?.from === "string"
      ? location.state.from
      : location.state?.from?.pathname || "/my-bookings";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/api/auth/signin", form);

      if (data.user && data.token) {
        signin(data.user, () => navigate(from, { replace: true }));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage(data.message || "❌ Invalid credentials.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center text-white drop-shadow mb-6">
          🔐 Welcome Back
        </h2>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg"
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-200 mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-white font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
