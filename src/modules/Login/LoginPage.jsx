import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Quote,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
    <div className="login-photo relative min-h-dvh w-full flex items-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-indigo-950/50 to-slate-950/20 pointer-events-none" />

      {/* Main Layout */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-5 sm:px-10 lg:px-[7vw] py-10">
        {/* ========================================
            LEFT SIDE - EDUCATIONAL QUOTE
        ======================================== */}
        <div className="hidden lg:flex flex-col justify-center text-white max-w-xl">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="ISST Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold tracking-wider">ISST</h2>

              <p className="text-xs text-indigo-200 tracking-widest uppercase mt-1">
                Admin Workspace
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-[2px] bg-indigo-300" />

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-200">
              Empowering Future Generations
            </span>
          </div>

          {/* Quote Icon */}
          <Quote
            size={48}
            strokeWidth={1.5}
            className="text-indigo-300/80 mb-5"
          />

          {/* Main Quote */}
          <h1 className="text-4xl xl:text-6xl font-extrabold leading-[1.2] tracking-tight">
            Education today.
            <span className="block mt-2 text-indigo-200">
              Empowerment tomorrow.
            </span>
          </h1>

          {/* Quote Description */}
          <p className="mt-7 text-base xl:text-lg leading-relaxed text-slate-200 max-w-lg">
            Every great career begins with the right guidance, the right
            knowledge, and the courage to dream beyond boundaries.
          </p>

          {/* Divider */}
          <div className="w-20 h-1 rounded-full bg-gradient-to-r from-indigo-300 to-blue-400 mt-8" />

          {/* Bottom Tagline */}
          <div className="mt-8 flex items-center gap-4 text-sm font-medium text-indigo-100">
            <span>Learn.</span>

            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />

            <span>Explore.</span>

            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />

            <span>Achieve.</span>
          </div>
        </div>

        {/* ========================================
            RIGHT SIDE - LOGIN FORM
        ======================================== */}
        <div className="flex items-center justify-center lg:justify-end w-full">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-6 sm:p-9">
            {/* Logo */}
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-200 overflow-hidden">
              <img
                src="/logo.png"
                alt="ISST Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="text-center text-3xl font-extrabold mt-5 text-slate-800">
              Welcome to ISST
            </h1>

            <p className="text-center text-sm text-slate-500 mt-2 mb-8">
              Sign in to your admin workspace
            </p>

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-slate-700"
                >
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

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-slate-700"
                >
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 transition-colors"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Secure Login Footer */}
            <div className="mt-7 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-indigo-500" />
                Secure Admin Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-4 left-[7vw] hidden lg:block text-xs text-white/60">
        © {new Date().getFullYear()} ISST. All rights reserved.
      </div>
    </div>
  );
}
