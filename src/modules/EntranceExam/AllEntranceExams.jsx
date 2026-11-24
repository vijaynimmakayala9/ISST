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
import { entranceExamApi } from "./entranceExamApi";
import AddEditExamCategory from "./AddEditExamCategory";
import AddEditEntranceExam from "./AddEditEntranceExam";
import SingleEntranceExam from "./SingleEntranceExam";

export default function AllEntranceExams() {
  const title = "Entrance Exams";
  const api = entranceExamApi;
  const tab = useMatch("/admin/entrance-exams/categories")
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

        {/* Entrance Exam Content */}
        <div className="relative z-10 min-w-0 flex-1">
          {/* Section Label */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-300" />

            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100">
              ISST · Entrance Exam Management
            </span>
          </div>

          {/* Dynamic Heading */}
          <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {tab === "categories" ? "Exam Categories" : title}
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

            {tab === "categories" ? "Add category" : "Add entrance exam"}
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
              EXAM CATEGORIES ILLUSTRATION
          ===================================== */}

                {/* Rear Folder */}
                <path
                  d="M72 45H145L165 65H282Q294 65 294 77V173Q294 185 282 185H72Q60 185 60 173V57Q60 45 72 45Z"
                  fill="#A5B4FC"
                />

                {/* First Question Paper */}
                <g transform="rotate(-9 130 100)">
                  <rect
                    x="80"
                    y="24"
                    width="105"
                    height="140"
                    rx="10"
                    fill="#EEF2FF"
                  />

                  {/* Paper Heading */}
                  <path
                    d="M95 41H169"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Multiple Choice Questions */}
                  {[59, 77, 95, 113].map((y) => (
                    <g key={y}>
                      <circle
                        cx="101"
                        cy={y}
                        r="5"
                        stroke="#818CF8"
                        strokeWidth="2"
                      />

                      <circle cx="101" cy={y} r="2.5" fill="#6366F1" />

                      <path
                        d={`M114 ${y}H169`}
                        stroke="#A5B4FC"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </g>

                {/* Second Question Paper */}
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

                  <path
                    d="M195 61H263M195 74H251M195 87H263"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Answer Grid */}
                  {[
                    [195, 100],
                    [219, 100],
                    [243, 100],
                    [195, 122],
                    [219, 122],
                    [243, 122],
                  ].map(([x, y]) => (
                    <rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width="16"
                      height="15"
                      rx="4"
                      fill="#C7D2FE"
                    />
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

                {/* Floating Question Paper Card */}
                <rect
                  x="264"
                  y="139"
                  width="65"
                  height="68"
                  rx="14"
                  fill="white"
                />

                <rect
                  x="275"
                  y="150"
                  width="43"
                  height="46"
                  rx="7"
                  fill="#EEF2FF"
                />

                <path
                  d="M283 160H309M283 170H304M283 180H309"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {/* =====================================
              ENTRANCE EXAMS ILLUSTRATION
          ===================================== */}

                {/* Exam Clipboard Shadow */}
                <rect
                  x="87"
                  y="24"
                  width="177"
                  height="181"
                  rx="15"
                  fill="#312E81"
                  fillOpacity="0.2"
                  transform="rotate(8 175 114)"
                />

                {/* Main Exam Clipboard */}
                <rect
                  x="77"
                  y="23"
                  width="175"
                  height="184"
                  rx="15"
                  fill="#A5B4FC"
                />

                {/* Exam Paper */}
                <rect
                  x="87"
                  y="34"
                  width="155"
                  height="162"
                  rx="10"
                  fill="white"
                />

                {/* Clipboard Clip */}
                <rect
                  x="128"
                  y="15"
                  width="73"
                  height="26"
                  rx="8"
                  fill="#6366F1"
                />

                <circle cx="164.5" cy="24" r="4" fill="#C7D2FE" />

                {/* Exam Paper Heading */}
                <rect
                  x="103"
                  y="51"
                  width="123"
                  height="8"
                  rx="4"
                  fill="#6366F1"
                />

                <rect
                  x="103"
                  y="65"
                  width="79"
                  height="4"
                  rx="2"
                  fill="#A5B4FC"
                />

                {/* Multiple Choice Questions */}
                {[82, 108, 134, 160].map((y, index) => (
                  <g key={y}>
                    {/* Question Container */}
                    <rect
                      x="101"
                      y={y}
                      width="128"
                      height="22"
                      rx="5"
                      fill="#EEF2FF"
                    />

                    {/* Answer Options */}
                    {[111, 127, 143].map((x, optionIndex) => (
                      <g key={x}>
                        <circle
                          cx={x}
                          cy={y + 11}
                          r="5"
                          stroke="#818CF8"
                          strokeWidth="1.5"
                        />

                        {optionIndex === index % 3 && (
                          <circle cx={x} cy={y + 11} r="2.8" fill="#4338CA" />
                        )}
                      </g>
                    ))}

                    {/* Question Text Lines */}
                    <path
                      d={`M157 ${y + 8}H217`}
                      stroke="#A5B4FC"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <path
                      d={`M157 ${y + 15}H201`}
                      stroke="#C7D2FE"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                ))}

                {/* Pencil Illustration */}
                <g transform="rotate(22 45 115)">
                  <rect
                    x="32"
                    y="35"
                    width="25"
                    height="139"
                    rx="5"
                    fill="#FBBF24"
                  />

                  {/* Pencil Highlight */}
                  <rect x="37" y="56" width="5" height="118" fill="#FDE68A" />

                  {/* Pencil Eraser */}
                  <rect
                    x="32"
                    y="22"
                    width="25"
                    height="20"
                    rx="5"
                    fill="#F9A8D4"
                  />

                  {/* Pencil Metal Ring */}
                  <rect x="32" y="42" width="25" height="10" fill="#C7D2FE" />

                  {/* Pencil Tip */}
                  <path d="M32 174H57L44.5 201Z" fill="#FDE68A" />

                  {/* Pencil Lead */}
                  <path d="M40 191H49L44.5 201Z" fill="#312E81" />
                </g>

                {/* Floating Stopwatch Card */}
                <rect
                  x="245"
                  y="118"
                  width="83"
                  height="88"
                  rx="16"
                  fill="white"
                />

                {/* Stopwatch Top Button */}
                <rect
                  x="278"
                  y="127"
                  width="17"
                  height="9"
                  rx="3"
                  fill="#6366F1"
                />

                <path
                  d="M307 139L312 134"
                  stroke="#6366F1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Stopwatch Body */}
                <circle cx="286.5" cy="166" r="29" fill="#C7D2FE" />

                <circle cx="286.5" cy="166" r="23" fill="#EEF2FF" />

                {/* Clock Indicators */}
                <path
                  d="M286.5 146V150
               M286.5 182V186
               M266.5 166H270.5
               M302.5 166H306.5"
                  stroke="#818CF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Clock Hands */}
                <path
                  d="M286.5 153V166L299 173"
                  stroke="#4338CA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="286.5" cy="166" r="3.5" fill="#6366F1" />

                {/* Floating Exam Completion Card */}
                <rect
                  x="261"
                  y="13"
                  width="66"
                  height="68"
                  rx="14"
                  fill="white"
                />

                <circle cx="294" cy="47" r="24" fill="#DCFCE7" />

                <circle cx="294" cy="47" r="17" fill="#22C55E" />

                <path
                  d="M285 47L291 54L303 40"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Common Decorative Sparkles */}
            <path
              d="M108 12V26M101 19H115
           M15 110V124M8 117H22
           M320 94V108M313 101H327"
              stroke="#C7D2FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Decorative Dots */}
            <circle cx="215" cy="13" r="4" fill="#A5B4FC" />
            <circle cx="20" cy="151" r="3" fill="#C7D2FE" />
            <circle cx="329" cy="120" r="4" fill="#A5B4FC" />
          </svg>
        </div>
      </div>
      <div className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2 rounded-xl bg-indigo-50 p-1">
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "items" ? "bg-white shadow text-indigo-700" : "text-slate-600"}`}
              aria-current={tab === "items" ? "page" : undefined}
              to="/admin/entrance-exams"
            >
              {title}
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "categories" ? "bg-white shadow text-indigo-700" : "text-slate-600"}`}
              aria-current={tab === "categories" ? "page" : undefined}
              to="/admin/entrance-exams/categories"
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
                    {row.name || row.title}
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
          <AddEditExamCategory
            item={editing.item}
            onClose={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              setNotice("Category saved successfully");
              refresh();
            }}
          />
        ) : (
          <AddEditEntranceExam
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
        <SingleEntranceExam
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
              Delete {pendingDelete.row.name || pendingDelete.row.title}?
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
