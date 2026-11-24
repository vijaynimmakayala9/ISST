import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Image,
  Landmark,
  Layers3,
  Map,
  RefreshCw,
  School,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { errorText } from "../../api/axiosInstance";
import { countRequests } from "./dashboardApi";

const sections = [
  ["education-levels", "Education Levels", GraduationCap],
  ["skill-development", "Skill Development", BookOpen],
  ["course-selection", "Course Selection", Layers3],
  ["career-route-map", "Career Route Map", Map],
  ["college-selection", "College Selection", School],
  ["banners", "Banners", Image],
  ["scholarships", "Scholarships", Award],
  ["entrance-exams", "Entrance Exams", ClipboardList],
  ["education-loans", "Education Loans", Landmark],
  ["admissions", "Admissions", FileCheck2],
  ["placement-trainings", "Placement Trainings", BriefcaseBusiness],
];

export default function Dashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all(
      sections.map(async ([key]) => {
        try {
          const count = await countRequests[key]();
          setStats((current) => ({ ...current, [key]: { count } }));
        } catch (failure) {
          setStats((current) => ({
            ...current,
            [key]: { error: errorText(failure) },
          }));
        }
      }),
    );
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-7">
      <section className="section-hero hero-dashboard flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-indigo-200">
            ISST Admin Dashboard
          </p>
          <h1 className="break-words text-3xl font-bold sm:text-4xl">
            Welcome, {session?.admin?.name || "Administrator"}
          </h1>
          <p className="mt-2 text-sm text-indigo-100 sm:text-base">
            Manage the education resources students use to plan their next step.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(([key, title, Icon]) => (
          <Link
            key={key}
            to={`/admin/${key}`}
            className="panel transition hover:border-indigo-500 hover:shadow-md focus-visible:outline-indigo-500"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                <Icon size={22} />
              </span>
              <ArrowUpRight size={18} className="text-indigo-500" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-indigo-950">
              {title}
            </h2>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {stats[key]?.count ?? (loading ? "…" : "—")}
            </p>
            {stats[key]?.error && (
              <p
                role="status"
                className="mt-2 break-words text-xs text-red-700"
              >
                {stats[key].error}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
