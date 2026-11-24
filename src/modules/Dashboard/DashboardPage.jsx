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
      <section className="relative isolate flex min-h-[200px] w-full items-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#312E81] via-[#4338CA] to-[#6366F1] px-5 py-6 text-white shadow-lg shadow-indigo-200 sm:px-8">
        {/* Full Width SVG Background Design */}
        <svg
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {/* Top Decorative Wave */}
          <path
            d="M700 0C880 170 1080 -30 1440 70V0H700Z"
            fill="#A5B4FC"
            fillOpacity="0.15"
          />

          {/* Bottom Decorative Waves */}
          <path
            d="M450 240C700 60 950 280 1180 130C1300 55 1380 100 1440 80V240H450Z"
            fill="#A5B4FC"
            fillOpacity="0.16"
          />

          <path
            d="M650 240C850 120 1050 260 1220 160C1330 100 1390 145 1440 125V240H650Z"
            fill="#C7D2FE"
            fillOpacity="0.15"
          />

          {/* Decorative Lines */}
          <path
            d="M750 0C850 180 1150 20 1440 110"
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="1.5"
          />

          <path
            d="M650 240C850 80 1100 270 1440 120"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />

          {/* Background Circles */}
          <circle
            cx="1280"
            cy="120"
            r="110"
            stroke="white"
            strokeOpacity="0.1"
          />

          <circle cx="1280" cy="120" r="90" fill="white" fillOpacity="0.05" />

          <circle cx="80" cy="20" r="130" fill="white" fillOpacity="0.025" />
        </svg>

        {/* Dashboard SVG Illustration */}
        <div className="pointer-events-none absolute inset-y-0 right-6 hidden w-[280px] items-center justify-center md:flex lg:right-12 lg:w-[340px]">
          <svg
            viewBox="0 0 340 220"
            className="h-auto max-h-[190px] w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Decorative Rings */}
            <circle
              cx="185"
              cy="110"
              r="103"
              stroke="white"
              strokeOpacity="0.15"
            />

            <circle cx="185" cy="110" r="85" fill="white" fillOpacity="0.06" />

            {/* Main Dashboard Window */}
            <rect
              x="65"
              y="35"
              width="240"
              height="155"
              rx="14"
              fill="#EEF2FF"
            />

            {/* Browser Header */}
            <path
              d="M65 49C65 41.3 71.3 35 79 35H291C298.7 35 305 41.3 305 49V62H65V49Z"
              fill="#C7D2FE"
            />

            <circle cx="79" cy="49" r="3" fill="#6366F1" />
            <circle cx="90" cy="49" r="3" fill="#818CF8" />
            <circle cx="101" cy="49" r="3" fill="#A5B4FC" />

            {/* Dashboard Sidebar */}
            <rect x="76" y="73" width="48" height="104" rx="7" fill="#E0E7FF" />

            <path
              d="M85 88H115M85 101H107M85 114H115M85 127H105M85 140H115M85 153H108"
              stroke="#A5B4FC"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Statistics Cards */}
            <rect x="136" y="73" width="48" height="25" rx="5" fill="#C7D2FE" />

            <rect x="190" y="73" width="48" height="25" rx="5" fill="#C7D2FE" />

            <rect x="244" y="73" width="48" height="25" rx="5" fill="#C7D2FE" />

            <path
              d="M146 86H171M200 86H225M254 86H279"
              stroke="#6366F1"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Chart Grid */}
            <path
              d="M139 114H290M139 132H290M139 150H290M139 168H290"
              stroke="#C7D2FE"
              strokeWidth="1"
            />

            {/* Chart Bars */}
            <rect
              x="146"
              y="140"
              width="19"
              height="28"
              rx="4"
              fill="#A5B4FC"
            />

            <rect
              x="175"
              y="121"
              width="19"
              height="47"
              rx="4"
              fill="#818CF8"
            />

            <rect
              x="204"
              y="132"
              width="19"
              height="36"
              rx="4"
              fill="#6366F1"
            />

            <rect
              x="233"
              y="111"
              width="19"
              height="57"
              rx="4"
              fill="#4338CA"
            />

            <rect
              x="262"
              y="104"
              width="19"
              height="64"
              rx="4"
              fill="#6366F1"
            />

            {/* Floating Analytics Card */}
            <rect x="18" y="128" width="84" height="63" rx="10" fill="white" />

            <path
              d="M29 174L43 157L56 164L75 141L90 145"
              stroke="#6366F1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path d="M29 174H90" stroke="#E0E7FF" strokeWidth="2" />

            {/* Floating Graduation Cap Card */}
            <rect x="262" y="12" width="64" height="58" rx="12" fill="white" />

            <path d="M272 34L294 23L316 34L294 45L272 34Z" fill="#6366F1" />

            <path d="M281 39V49C289 56 299 56 307 49V39" fill="#4338CA" />

            <path
              d="M316 34V49"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Decorative Elements */}
            <path
              d="M28 55V69M21 62H35M320 145V159M313 152H327"
              stroke="#C7D2FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <circle cx="44" cy="105" r="4" fill="#A5B4FC" />
            <circle cx="315" cy="100" r="3" fill="#C7D2FE" />
            <circle cx="138" cy="19" r="3" fill="#A5B4FC" />
          </svg>
        </div>

        {/* Dashboard Content */}
        <div className="relative z-10 min-w-0 w-full md:max-w-[60%]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-300" />

            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100">
              ISST Admin Dashboard
            </span>
          </div>

          <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl xl:text-4xl">
            Welcome,{" "}
            <span className="text-indigo-200">
              {session?.admin?.name || "Administrator"}
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
            Manage the education resources students use to plan their next step.
          </p>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
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
