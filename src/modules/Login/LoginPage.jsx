import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GraduationCap, LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { errorText } from "../../api/axiosInstance";
export default function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (session) return <Navigate to="/admin/dashboard" replace />;
  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-photo min-h-dvh flex items-center justify-center p-4 lg:justify-end lg:px-[9vw]">
      <div className="w-full max-w-md bg-white/95 border border-white shadow-2xl rounded-3xl p-5 sm:p-8">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-700 text-white">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-center text-3xl font-extrabold mt-5 text-slate-800">
          Welcome to ISST
        </h1>
        <p className="text-center text-slate-500 mt-2 mb-8">
          Sign in to your admin workspace
        </p>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="text-sm font-semibold">
              Email address
            </label>
            <div className="relative mt-2">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                size={19}
              />
              <input
                className="field h-12 !pl-11"
                id="login-email"
                autoComplete="username"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="text-sm font-semibold">
              Password
            </label>
            <div className="relative mt-2">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                size={19}
              />
              <input
                className="field h-12 !pl-11 !pr-12"
                id="login-password"
                autoComplete="current-password"
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
            >
              {error}
            </p>
          )}
          <button disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
