import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
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

  const fieldClass =
    "w-full h-12 rounded-xl border border-indigo-200 bg-white/80 pl-11 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400";

  return (
    <div
      className="relative flex min-h-dvh w-full items-center overflow-hidden bg-[#EEF2FF] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/login-bg.svg')",
      }}
    >
      {/* Global Background Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-white/15 to-transparent"
      />

      {/* Left Side Overlay - Improves Text Visibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[68%] bg-gradient-to-r from-[#F8FAFF]/95 via-[#F8FAFF]/75 to-transparent lg:block"
      />

      {/* Main Layout */}
      <main className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:px-[6vw] xl:gap-16">
        {/* ========================================
            LEFT SIDE - EDUCATIONAL CONTENT
        ======================================== */}

        <section className="hidden w-full min-w-0 max-w-[620px] flex-col self-center text-[#312E81] lg:flex">
          {/* Branding */}
          <div className="mb-8 flex items-center gap-4 xl:mb-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white shadow-md">
              <img
                src="/logo.png"
                alt="ISST Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-3xl font-extrabold tracking-wide text-[#312E81]">
                ISST
              </h2>

              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#4338CA]">
                Admin Workspace
              </p>
            </div>
          </div>

          {/* Educational Tagline */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-0.5 w-8 shrink-0 rounded-full bg-indigo-500" />

            <span className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.14em] text-[#4338CA] xl:text-xs">
              Empowering Future Generations
            </span>
          </div>

          {/* Quote Icon */}
          <Quote
            size={36}
            strokeWidth={1.7}
            className="mb-3 text-[#6366F1]"
            aria-hidden="true"
          />

          {/* Main Heading */}
          <h1 className="max-w-full break-words text-[clamp(1.875rem,2.85vw,3rem)] font-extrabold leading-[1.18] tracking-tight">
            <span className="block text-[#312E81]">
              Education today.
            </span>

            <span className="mt-2 block text-[#4338CA]">
              Empowerment tomorrow.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-[480px] text-[15px] font-medium leading-[1.8] text-slate-700 xl:text-base">
            Every great career begins with the right guidance,
            the right knowledge, and the courage to dream beyond
            boundaries.
          </p>

          {/* Gradient Divider */}
          <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#4338CA] to-[#818CF8]" />

          {/* Bottom Tagline */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-[#312E81]">
            <span>Learn.</span>

            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

            <span>Explore.</span>

            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

            <span>Achieve.</span>
          </div>
        </section>

        {/* ========================================
            RIGHT SIDE - LOGIN FORM
        ======================================== */}

        <section className="flex w-full justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-[28px] border border-white bg-white/85 p-6 shadow-2xl shadow-indigo-900/15 backdrop-blur-xl sm:p-9">
            {/* Logo */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg shadow-indigo-100">
              <img
                src="/logo.png"
                alt="ISST Logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-center text-3xl font-extrabold text-[#312E81]">
              Welcome to ISST
            </h1>

            <p className="mb-8 mt-2 text-center text-sm text-slate-500">
              Sign in to your admin workspace
            </p>

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-5">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                  />

                  <input
                    id="login-email"
                    className={fieldClass}
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
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                  />

                  <input
                    id="login-password"
                    className={`${fieldClass} pr-12`}
                    autoComplete="current-password"
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 transition-colors hover:text-indigo-700"
                    aria-label={
                      show ? "Hide password" : "Show password"
                    }
                    onClick={() => setShow((prev) => !prev)}
                  >
                    {show ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#6366F1] py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

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
            <div className="mt-7 border-t border-indigo-100 pt-5">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck
                  size={16}
                  className="text-indigo-500"
                />

                Secure Admin Access
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Copyright */}
      <footer className="absolute bottom-3 left-0 w-full text-center text-xs font-medium text-indigo-900/60">
        © {new Date().getFullYear()} ISST. All rights reserved.
      </footer>
    </div>
  );
}