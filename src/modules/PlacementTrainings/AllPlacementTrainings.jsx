import React, { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { errorText } from "../../api/axiosInstance";
import useDebounce from "../../hooks/useDebounce";
import { list as listEducationLevels } from "../EducationLevels/educationLevelsApi";
import { placementTrainingApi } from "./placementTrainingApi";
import AddEditPlacementCategory from "./AddEditPlacementCategory";
import AddEditPlacementTraining from "./AddEditPlacementTraining";
import SinglePlacementTraining from "./SinglePlacementTraining";

export default function AllPlacementTrainings() {
  const title = "Placement Trainings";
  const api = placementTrainingApi;
  const tab = useMatch("/admin/placement-trainings/categories")
    ? "categories"
    : "items";
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [levels, setLevels] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(undefined);
  const [view, setView] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [filters, setFilters] = useState({});
  const search = useDebounce(query, 300);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [metadataError, setMetadataError] = useState("");
  const [openingId, setOpeningId] = useState(null);
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((n) => n + 1);
  useEffect(() => {
    let active = true;
    setMetadataError("");
    api
      .listCategories()
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((failure) => {
        if (active) setMetadataError(errorText(failure));
      });
    if (tab === "items") {
      listEducationLevels()
        .then((result) => {
          if (active) setLevels(result.rows);
        })
        .catch((failure) => {
          if (active) setMetadataError(errorText(failure));
        });
    }
    return () => {
      active = false;
    };
  }, [api, revision, tab]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    if (tab === "categories") {
      setLoading(false);
      return;
    }
    const params = {
      page,
      limit: 20,
      ...(filter ? { categoryId: filter } : {}),
      ...Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      ),
      ...(search.trim() ? { q: search.trim() } : {}),
    };
    Promise.resolve(api.list(params))
      .then((result) => {
        if (!active) return;
        setRows(Array.isArray(result) ? result : result.rows);
        setTotal(Array.isArray(result) ? result.length : result.total);
      })
      .catch((e) => {
        if (active) setError(errorText(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, page, filter, search, revision, tab, filters]);
  async function openEditor(row) {
    if (tab === "categories") {
      setEditing({ category: true, item: row });
      return;
    }
    if (openingId) return;
    setOpeningId(row._id);
    setError("");
    try {
      const item = await api.get(row._id);
      if (!item) throw Error("Record details are unavailable.");
      setEditing({ category: false, item });
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setOpeningId(null);
    }
  }
  async function remove(row, isCategory) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (isCategory) await api.deleteCategory(row._id);
      else await api.remove(row._id);
      setPendingDelete(null);
      if (!isCategory && rows.length === 1 && page > 1)
        setPage((value) => value - 1);
      setNotice("Deleted successfully");
      refresh();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const level = levels.find((entry) => entry.name === filters.level);
  const course = level?.courses?.find((entry) => entry.name === filters.course);
  const setFilterValue = (field, value) => {
    setPage(1);
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field === "level" ? { course: "", branch: "" } : {}),
      ...(field === "course" ? { branch: "" } : {}),
    }));
  };
  const selected = tab === "categories" ? categories : loading ? [] : rows;
  return (
    <div className="space-y-6">
      <div className="relative isolate flex min-h-[200px] w-full items-center justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#312E81] via-[#4338CA] to-[#6366F1] px-5 py-6 text-white shadow-lg shadow-indigo-200 sm:px-8">
        {/* Full Width SVG Background */}
        <svg
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {/* Top Wave */}
          <path
            d="M700 0C880 170 1080 -30 1440 70V0H700Z"
            fill="#A5B4FC"
            fillOpacity="0.15"
          />

          {/* Bottom Waves */}
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
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />

          <path
            d="M650 240C850 80 1100 270 1440 120"
            stroke="white"
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />

          {/* Decorative Circles */}
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

        {/* Placement Training Content */}
        <div className="relative z-10 min-w-0 flex-1">
          {/* Section Label */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-300" />

            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100">
              ISST · Placement Management
            </span>
          </div>

          {/* Dynamic Heading */}
          <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {tab === "categories" ? "Placement Categories" : title}
          </h1>

          {/* Dynamic Description */}
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
            {tab === "categories"
              ? "Create and organize categories."
              : `Manage ${title.toLowerCase()}.`}
          </p>

          {/* Dynamic Add Button */}
          <button
            type="button"
            onClick={() =>
              setEditing({
                category: tab === "categories",
                item: null,
              })
            }
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#4338CA] shadow-md transition-all duration-200 hover:bg-indigo-50 active:scale-95"
          >
            <Plus size={18} />

            {tab === "categories" ? "Add category" : "Add placement training"}
          </button>
        </div>

        {/* Dynamic SVG Illustration */}
        <div className="pointer-events-none relative hidden w-[32%] max-w-[340px] shrink-0 items-center justify-center md:flex">
          <svg
            viewBox="0 0 340 220"
            className="h-auto max-h-[190px] w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Background Rings */}
            <circle
              cx="175"
              cy="110"
              r="103"
              stroke="white"
              strokeOpacity="0.15"
            />

            <circle cx="175" cy="110" r="85" fill="white" fillOpacity="0.06" />

            {tab === "categories" ? (
              <>
                {/* =====================================
              PLACEMENT CATEGORIES ILLUSTRATION
          ===================================== */}

                {/* Rear Folder */}
                <path
                  d="M72 45H145L165 65H282Q294 65 294 77V173Q294 185 282 185H72Q60 185 60 173V57Q60 45 72 45Z"
                  fill="#A5B4FC"
                />

                {/* Professional Resume Document */}
                <g transform="rotate(-9 130 100)">
                  <rect
                    x="80"
                    y="24"
                    width="105"
                    height="140"
                    rx="10"
                    fill="#EEF2FF"
                  />

                  {/* Profile Avatar */}
                  <circle cx="104" cy="49" r="15" fill="#C7D2FE" />

                  <circle cx="104" cy="44" r="5" fill="#6366F1" />

                  <path d="M94 59C94 47 114 47 114 59Z" fill="#818CF8" />

                  {/* Resume Heading */}
                  <path
                    d="M126 44H170"
                    stroke="#6366F1"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M126 55H158"
                    stroke="#A5B4FC"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Resume Content */}
                  <path
                    d="M95 80H169
                 M95 94H169
                 M95 108H155
                 M95 122H169"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </g>

                {/* Training Document */}
                <g transform="rotate(9 225 95)">
                  <rect
                    x="180"
                    y="27"
                    width="98"
                    height="135"
                    rx="10"
                    fill="white"
                  />

                  <path
                    d="M195 46H263"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Training Checklist */}
                  {[61, 82, 103, 124].map((y) => (
                    <g key={y}>
                      <rect
                        x="195"
                        y={y}
                        width="14"
                        height="14"
                        rx="4"
                        fill="#E0E7FF"
                      />

                      <path
                        d={`M198 ${y + 7}L201 ${y + 10}L206 ${y + 4}`}
                        stroke="#4338CA"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d={`M217 ${y + 7}H263`}
                        stroke="#A5B4FC"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </g>

                {/* Front Folder */}
                <path
                  d="M49 100Q50 89 63 89H291Q305 89 303 103L287 190Q285 201 272 201H70Q57 201 55 188L39 108Q38 100 49 100Z"
                  fill="#C7D2FE"
                />

                {/* Folder Highlight */}
                <path
                  d="M53 106H289"
                  stroke="#EEF2FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Category Grid Container */}
                <rect
                  x="109"
                  y="117"
                  width="125"
                  height="66"
                  rx="12"
                  fill="#EEF2FF"
                />

                {/* Category Cards */}
                {[
                  [120, 127],
                  [177, 127],
                  [120, 153],
                  [177, 153],
                ].map(([x, y]) => (
                  <g key={`${x}-${y}`}>
                    <rect
                      x={x}
                      y={y}
                      width="46"
                      height="20"
                      rx="5"
                      fill="#818CF8"
                    />

                    <path
                      d={`M${x + 10} ${y + 10}H${x + 36}`}
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                ))}

                {/* Floating Category Icon */}
                <rect
                  x="10"
                  y="17"
                  width="70"
                  height="66"
                  rx="14"
                  fill="white"
                />

                {[
                  [22, 29],
                  [48, 29],
                  [22, 55],
                  [48, 55],
                ].map(([x, y]) => (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width="19"
                    height="19"
                    rx="5"
                    fill="#6366F1"
                  />
                ))}

                {/* Floating Professional Briefcase Card */}
                <rect
                  x="257"
                  y="135"
                  width="72"
                  height="72"
                  rx="15"
                  fill="white"
                />

                <rect
                  x="266"
                  y="144"
                  width="54"
                  height="54"
                  rx="12"
                  fill="#EEF2FF"
                />

                {/* Briefcase Handle */}
                <path
                  d="M283 160V152H303V160"
                  stroke="#4338CA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Briefcase Body */}
                <rect
                  x="272"
                  y="160"
                  width="42"
                  height="29"
                  rx="6"
                  fill="#6366F1"
                />

                <path d="M272 172H314" stroke="#C7D2FE" strokeWidth="2" />

                <rect
                  x="289"
                  y="169"
                  width="8"
                  height="7"
                  rx="2"
                  fill="white"
                />
              </>
            ) : (
              <>
                {/* =====================================
              PLACEMENT TRAININGS ILLUSTRATION
          ===================================== */}

                {/* Professional Resume */}
                <g transform="rotate(-9 85 100)">
                  <rect
                    x="20"
                    y="23"
                    width="132"
                    height="165"
                    rx="12"
                    fill="white"
                  />

                  {/* Profile Avatar */}
                  <circle cx="49" cy="52" r="19" fill="#E0E7FF" />

                  <circle cx="49" cy="46" r="7" fill="#818CF8" />

                  <path d="M36 65C36 48 62 48 62 65Z" fill="#818CF8" />

                  {/* Profile Information */}
                  <path
                    d="M78 45H138"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M78 58H125"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Resume Content */}
                  <path
                    d="M34 85H138
                 M34 99H127
                 M34 113H138
                 M34 127H116
                 M34 141H138"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Resume Skill Indicators */}
                  {[34, 70, 106].map((x) => (
                    <rect
                      key={x}
                      x={x}
                      y="158"
                      width="28"
                      height="13"
                      rx="4"
                      fill="#C7D2FE"
                    />
                  ))}
                </g>

                {/* Career Growth Chart Card */}
                <rect
                  x="185"
                  y="12"
                  width="141"
                  height="106"
                  rx="14"
                  fill="#EEF2FF"
                />

                {/* Chart Heading */}
                <path
                  d="M199 25H262"
                  stroke="#6366F1"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Chart Grid */}
                <path
                  d="M199 46H312
               M199 64H312
               M199 82H312
               M199 100H312"
                  stroke="#C7D2FE"
                  strokeWidth="1.5"
                />

                {/* Career Growth Bars */}
                {[
                  [204, 77, 23],
                  [232, 65, 35],
                  [260, 52, 48],
                  [288, 38, 62],
                ].map(([x, y, height], index) => (
                  <rect
                    key={x}
                    x={x}
                    y={y}
                    width="18"
                    height={height}
                    rx="4"
                    fill={["#A5B4FC", "#818CF8", "#6366F1", "#4338CA"][index]}
                  />
                ))}

                {/* Growth Arrow */}
                <path
                  d="M205 67L234 53L263 58L302 28"
                  stroke="#4338CA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M289 28H302V41"
                  stroke="#4338CA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Briefcase Shadow */}
                <ellipse
                  cx="173"
                  cy="206"
                  rx="120"
                  ry="9"
                  fill="#312E81"
                  fillOpacity="0.2"
                />

                {/* Professional Briefcase Handle */}
                <rect
                  x="128"
                  y="81"
                  width="83"
                  height="47"
                  rx="12"
                  stroke="#C7D2FE"
                  strokeWidth="10"
                />

                {/* Main Briefcase Body */}
                <rect
                  x="57"
                  y="109"
                  width="226"
                  height="94"
                  rx="15"
                  fill="#818CF8"
                />

                {/* Briefcase Upper Section */}
                <path
                  d="M57 124C57 115.7 63.7 109 72 109H268C276.3 109 283 115.7 283 124V150H57V124Z"
                  fill="#C7D2FE"
                />

                {/* Briefcase Upper Highlight */}
                <path
                  d="M70 117H270"
                  stroke="#EEF2FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Briefcase Vertical Straps */}
                <rect x="90" y="109" width="13" height="94" fill="#A5B4FC" />

                <rect x="237" y="109" width="13" height="94" fill="#A5B4FC" />

                {/* Briefcase Center Lock */}
                <rect
                  x="153"
                  y="139"
                  width="34"
                  height="27"
                  rx="6"
                  fill="#4338CA"
                />

                <rect
                  x="160"
                  y="146"
                  width="20"
                  height="13"
                  rx="3"
                  fill="#FDE68A"
                />

                <circle cx="170" cy="152.5" r="2.5" fill="#92400E" />

                {/* Briefcase Bottom Detail */}
                <path
                  d="M72 191H269"
                  stroke="#C7D2FE"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Floating Placement Success Card */}
                <rect
                  x="252"
                  y="135"
                  width="77"
                  height="72"
                  rx="16"
                  fill="white"
                />

                <circle cx="290.5" cy="171" r="26" fill="#DCFCE7" />

                <circle cx="290.5" cy="171" r="19" fill="#22C55E" />

                <path
                  d="M280 171L287 178L301 163"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Floating Interview Card */}
                <rect
                  x="10"
                  y="141"
                  width="61"
                  height="57"
                  rx="12"
                  fill="white"
                />

                {/* Interview Chat Bubble */}
                <path d="M21 152H60V177H43L34 186V177H21V152Z" fill="#E0E7FF" />

                <circle cx="30" cy="164" r="3" fill="#6366F1" />
                <circle cx="40" cy="164" r="3" fill="#6366F1" />
                <circle cx="50" cy="164" r="3" fill="#6366F1" />
              </>
            )}

            {/* Common Decorative Sparkles */}
            <path
              d="M165 12V26M158 19H172
           M10 110V124M3 117H17
           M320 124V134M315 129H325"
              stroke="#C7D2FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Decorative Dots */}
            <circle cx="160" cy="51" r="4" fill="#A5B4FC" />
            <circle cx="15" cy="95" r="3" fill="#C7D2FE" />
            <circle cx="330" cy="8" r="4" fill="#A5B4FC" />
          </svg>
        </div>
      </div>
      <div className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2 rounded-xl bg-indigo-50 p-1">
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "items" ? "bg-white shadow text-indigo-700" : "text-slate-600"}`}
              aria-current={tab === "items" ? "page" : undefined}
              to="/admin/placement-trainings"
            >
              {title}
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "categories" ? "bg-white shadow text-indigo-700" : "text-slate-600"}`}
              aria-current={tab === "categories" ? "page" : undefined}
              to="/admin/placement-trainings/categories"
            >
              Categories
            </Link>
          </div>
          <button className="btn-secondary" onClick={refresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        {tab === "items" && (
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="relative flex-1 min-w-[180px] max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
              />
              <input
                className="field !pl-11"
                type="search"
                aria-label="Search records"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={query}
                onChange={(e) => {
                  setPage(1);
                  setQuery(e.target.value);
                }}
              />
            </div>
            <select
              className="field max-w-56"
              aria-label="Category filter"
              value={filter}
              onChange={(e) => {
                setPage(1);
                setFilter(e.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id || c.scholarshipType} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {tab === "items" && (
          <details className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <summary className="cursor-pointer text-sm font-semibold">
              More filters
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm font-semibold">
                Education level
                <select
                  className="field mt-1"
                  value={filters.level || ""}
                  onChange={(event) =>
                    setFilterValue("level", event.target.value)
                  }
                >
                  <option value="">Any level</option>
                  {levels.map((entry) => (
                    <option key={entry._id} value={entry.name}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Course
                <select
                  className="field mt-1"
                  value={filters.course || ""}
                  disabled={!level}
                  onChange={(event) =>
                    setFilterValue("course", event.target.value)
                  }
                >
                  <option value="">Any course</option>
                  {level?.courses?.map((entry) => (
                    <option key={entry.name}>{entry.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Branch
                <select
                  className="field mt-1"
                  value={filters.branch || ""}
                  disabled={!course}
                  onChange={(event) =>
                    setFilterValue("branch", event.target.value)
                  }
                >
                  <option value="">Any branch</option>
                  {course?.branches?.map((entry) => (
                    <option key={entry.name}>{entry.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Video
                <select
                  className="field mt-1"
                  value={filters.includeVideo || ""}
                  onChange={(event) =>
                    setFilterValue("includeVideo", event.target.value)
                  }
                >
                  <option value="">Any</option>
                  <option value="true">Has video</option>
                  <option value="false">No video</option>
                </select>
              </label>
            </div>
          </details>
        )}
        {metadataError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-red-50 p-3 text-red-700"
          >
            {metadataError}
          </p>
        )}
        {openingId && (
          <p role="status" className="mb-4 text-sm text-indigo-700">
            Loading record for editing…
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="bg-red-50 text-red-700 p-3 rounded-xl mb-4"
          >
            {error}
          </p>
        )}
        {notice && (
          <p className="bg-indigo-50 text-indigo-800 p-3 rounded-xl mb-4">
            {notice}
          </p>
        )}
        <div className="record-table-frame">
          <table className="record-table" role="table">
            <thead role="rowgroup">
              <tr role="row">
                <th
                  scope="col"
                  role="columnheader"
                  className="record-table-number"
                >
                  S.No.
                </th>
                {(tab === "categories"
                  ? ["Category", "Description"]
                  : ["Name", "Category / Tag", "Description"]
                ).map((c) => (
                  <th scope="col" role="columnheader" key={c}>
                    {c}
                  </th>
                ))}
                <th scope="col" role="columnheader">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {selected.map((row, index) => (
                <tr role="row" key={row._id || row.scholarshipType}>
                  <td
                    role="cell"
                    data-label="S.No."
                    className="record-table-number"
                  >
                    <span>
                      {(tab === "categories" ? 0 : (page - 1) * 20) + index + 1}
                    </span>
                  </td>
                  <td
                    role="cell"
                    data-label={tab === "categories" ? "Category" : "Name"}
                    className="record-table-primary"
                  >
                    <div className="flex items-center gap-3">
                      {row.thumbnail && /^https?:\/\//i.test(row.thumbnail) && (
                        <img
                          className="h-12 w-16 rounded-lg object-cover"
                          src={row.thumbnail}
                          alt=""
                          loading="lazy"
                        />
                      )}
                      {row.title}
                    </div>
                  </td>
                  <td
                    role="cell"
                    data-label={
                      tab === "categories" ? "Description" : "Category / Tag"
                    }
                  >
                    {tab === "categories"
                      ? row.description
                      : categories.find((c) => c._id === row.categoryId)
                          ?.title || row.tag}
                  </td>
                  {tab !== "categories" && (
                    <td
                      role="cell"
                      data-label="Description"
                      className="record-table-description"
                    >
                      <p className="record-table-summary">
                        {row.description || "—"}
                      </p>
                    </td>
                  )}
                  <td
                    role="cell"
                    data-label="Actions"
                    className="record-table-actions"
                  >
                    <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                      {tab === "items" && (
                        <button
                          aria-label="View details"
                          title="View details"
                          className="p-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                          onClick={() => setView(row)}
                        >
                          <Eye size={17} />
                        </button>
                      )}
                      <button
                        aria-label="Edit"
                        title="Edit"
                        className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100"
                        disabled={Boolean(openingId)}
                        onClick={() => openEditor(row)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        aria-label="Delete"
                        title="Delete"
                        disabled={busy}
                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                        onClick={() => {
                          setError("");
                          setPendingDelete({
                            row,
                            category: tab === "categories",
                          });
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !selected.length && (
          <p className="py-12 text-center text-slate-500">No records found.</p>
        )}
        {loading && tab === "items" && (
          <p className="py-12 text-center text-slate-500">Loading...</p>
        )}
        {tab === "items" && (
          <div className="flex justify-between items-center mt-5 text-sm">
            <span className="text-slate-500">
              Page {page} · {total} total
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                aria-label="Previous page"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="btn-secondary"
                aria-label="Next page"
                disabled={page * 20 >= total || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {editing &&
        (editing.category ? (
          <AddEditPlacementCategory
            item={editing.item}
            onClose={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              setNotice("Category saved successfully");
              refresh();
            }}
          />
        ) : (
          <AddEditPlacementTraining
            categories={categories}
            levels={levels}
            item={editing.item}
            onClose={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              setNotice("Saved successfully");
              refresh();
            }}
          />
        ))}
      {view && (
        <SinglePlacementTraining
          item={view}
          onClose={() => setView(null)}
          onEdit={(item) => {
            setView(null);
            setEditing({ category: false, item });
          }}
        />
      )}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm deletion"
            className="panel w-full max-w-md"
          >
            <h2 className="text-lg font-bold">
              Delete {pendingDelete.row.title || pendingDelete.row.title}?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This action is permanent.
            </p>
            {error && (
              <p role="alert" className="mt-3 text-red-700">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="btn-secondary"
                disabled={busy}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={busy}
                onClick={() =>
                  remove(pendingDelete.row, pendingDelete.category)
                }
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
