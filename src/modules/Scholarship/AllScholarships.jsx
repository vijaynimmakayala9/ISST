import React, { useEffect, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, RefreshCw, Search } from "lucide-react";
import { errorText } from "../../api/axiosInstance";
import useDebounce from "../../hooks/useDebounce";
import { list as listEducationLevels } from "../EducationLevels/educationLevelsApi";
import { scholarshipApi } from "./scholarshipApi";
import AddEditScholarshipCategory from "./AddEditScholarshipCategory";
import AddEditScholarship from "./AddEditScholarship";
import SingleScholarship from "./SingleScholarship";

export default function AllScholarships() {
  const title = "Scholarships";
  const api = scholarshipApi;
  const tab = useMatch("/admin/scholarships/categories")
    ? "categories"
    : "items";
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [levels, setLevels] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(undefined);
  const [view, setView] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
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
      ...(filter ? { scholarshipType: filter } : {}),
      ...(search.trim() ? { q: search.trim() } : {}),
    };
    Promise.resolve(api.list(params))
      .then((result) => {
        if (!active) return;
        setRows(Array.isArray(result) ? result : result.rows);
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
  }, [api, filter, search, revision, tab]);
  async function openEditor(row) {
    if (tab === "categories") {
      setEditing({ category: true, item: row });
      return;
    }
    if (openingId) return;
    setOpeningId(row.scholarshipCategoryId);
    setError("");
    try {
      const item = await api.get(row.scholarshipCategoryId);
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
      if (isCategory) await api.deleteCategory(row.scholarshipType);
      else await api.remove(row.scholarshipCategoryId);
      setPendingDelete(null);
      setNotice("Deleted successfully");
      refresh();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
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

        {/* Scholarship Content */}
        <div className="relative z-10 min-w-0 flex-1">
          {/* Section Label */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-300" />

            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100">
              ISST · Scholarship Management
            </span>
          </div>

          {/* Dynamic Heading */}
          <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {tab === "categories" ? "Scholarship Categories" : title}
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

            {tab === "categories" ? "Add category" : "Add scholarship"}
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
              SCHOLARSHIP CATEGORIES ILLUSTRATION
          ===================================== */}

                {/* Rear Folder */}
                <path
                  d="M72 45H145L165 65H282Q294 65 294 77V173Q294 185 282 185H72Q60 185 60 173V57Q60 45 72 45Z"
                  fill="#A5B4FC"
                />

                {/* Scholarship Document */}
                <g transform="rotate(-9 130 100)">
                  <rect
                    x="80"
                    y="24"
                    width="105"
                    height="140"
                    rx="10"
                    fill="#EEF2FF"
                  />

                  {/* Document Heading */}
                  <path
                    d="M95 42H169"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Document Content */}
                  <path
                    d="M95 61H169
                 M95 75H155
                 M95 89H169
                 M95 103H148"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Scholarship Star */}
                  <path
                    d="M132 112L138 123L151 125L142 134L144 147L132 141L120 147L122 134L113 125L126 123Z"
                    fill="#FBBF24"
                  />
                </g>

                {/* Scholarship Certificate */}
                <g transform="rotate(9 225 95)">
                  <rect
                    x="180"
                    y="27"
                    width="98"
                    height="135"
                    rx="10"
                    fill="white"
                  />

                  <rect
                    x="189"
                    y="36"
                    width="80"
                    height="117"
                    rx="6"
                    stroke="#C7D2FE"
                    strokeWidth="2"
                  />

                  <path
                    d="M199 48H259"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M199 64H259
                 M199 78H249
                 M199 92H259"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Certificate Ribbon */}
                  <path
                    d="M218 125L212 145L229 138L246 145L240 125Z"
                    fill="#818CF8"
                  />

                  {/* Certificate Medal */}
                  <circle cx="229" cy="119" r="17" fill="#6366F1" />

                  <circle
                    cx="229"
                    cy="119"
                    r="11"
                    stroke="#C7D2FE"
                    strokeWidth="2"
                  />
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

                {/* Floating Scholarship Award Card */}
                <rect
                  x="257"
                  y="135"
                  width="72"
                  height="72"
                  rx="15"
                  fill="white"
                />

                {/* Award Ribbon */}
                <path
                  d="M280 170L274 196L293 187L312 196L306 170Z"
                  fill="#818CF8"
                />

                {/* Award Medal */}
                <circle cx="293" cy="163" r="23" fill="#FBBF24" />

                <circle
                  cx="293"
                  cy="163"
                  r="18"
                  stroke="#FDE68A"
                  strokeWidth="2"
                />

                {/* Award Star */}
                <path
                  d="M293 149L297 158L307 159L300 166L302 176L293 171L284 176L286 166L279 159L289 158Z"
                  fill="#FFF7D6"
                />
              </>
            ) : (
              <>
                {/* =====================================
              SCHOLARSHIPS ILLUSTRATION
          ===================================== */}

                {/* Scholarship Certificate */}
                <g transform="rotate(10 260 105)">
                  <rect
                    x="207"
                    y="22"
                    width="111"
                    height="158"
                    rx="12"
                    fill="white"
                  />

                  {/* Certificate Border */}
                  <rect
                    x="216"
                    y="31"
                    width="93"
                    height="140"
                    rx="7"
                    stroke="#C7D2FE"
                    strokeWidth="2"
                  />

                  {/* Certificate Heading */}
                  <path
                    d="M230 48H295"
                    stroke="#6366F1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Certificate Details */}
                  <path
                    d="M226 65H300
                 M226 79H291
                 M226 93H300
                 M226 107H281"
                    stroke="#A5B4FC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Certificate Ribbon */}
                  <path
                    d="M251 139L245 162L263 154L281 162L275 139Z"
                    fill="#818CF8"
                  />

                  <circle cx="263" cy="133" r="19" fill="#6366F1" />

                  <circle
                    cx="263"
                    cy="133"
                    r="13"
                    stroke="#C7D2FE"
                    strokeWidth="2"
                  />

                  <path
                    d="M256 133L261 138L270 127"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Trophy Shadow */}
                <ellipse
                  cx="143"
                  cy="206"
                  rx="111"
                  ry="9"
                  fill="#312E81"
                  fillOpacity="0.2"
                />

                {/* Left Trophy Handle */}
                <path
                  d="M80 48H49V75C49 105 70 117 104 117"
                  stroke="#FBBF24"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Right Trophy Handle */}
                <path
                  d="M202 48H233V75C233 105 212 117 178 117"
                  stroke="#FBBF24"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Main Trophy Cup */}
                <path
                  d="M78 30H204V73
               C204 113 178 141 141 141
               C104 141 78 113 78 73Z"
                  fill="#FBBF24"
                />

                {/* Trophy Upper Border */}
                <rect
                  x="72"
                  y="25"
                  width="138"
                  height="14"
                  rx="6"
                  fill="#FDE68A"
                />

                {/* Trophy Highlight */}
                <path
                  d="M89 45H106V82
               C106 102 117 118 132 127
               C105 121 89 102 89 77Z"
                  fill="#FDE68A"
                />

                {/* Trophy Star */}
                <path
                  d="M141 51
               L152 73
               L177 77
               L159 95
               L163 120
               L141 108
               L119 120
               L123 95
               L105 77
               L130 73Z"
                  fill="#FFF7D6"
                />

                {/* Trophy Stem */}
                <rect
                  x="129"
                  y="135"
                  width="24"
                  height="37"
                  rx="4"
                  fill="#F59E0B"
                />

                {/* Trophy Bottom Support */}
                <path
                  d="M129 155H153
               C153 167 164 171 177 175
               V182H105V175
               C118 171 129 167 129 155Z"
                  fill="#FBBF24"
                />

                {/* Trophy Base */}
                <rect
                  x="88"
                  y="178"
                  width="106"
                  height="25"
                  rx="6"
                  fill="#C7D2FE"
                />

                {/* Trophy Base Name Plate */}
                <rect
                  x="111"
                  y="185"
                  width="60"
                  height="11"
                  rx="3"
                  fill="#6366F1"
                />

                <path
                  d="M122 190.5H160"
                  stroke="#E0E7FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Floating Graduation Cap Card */}
                <rect
                  x="10"
                  y="10"
                  width="78"
                  height="62"
                  rx="14"
                  fill="white"
                />

                {/* Graduation Cap */}
                <path d="M19 32L49 17L79 32L49 47Z" fill="#6366F1" />

                <path
                  d="M30 38V51
               C40 61 58 61 68 51
               V38L49 47Z"
                  fill="#4338CA"
                />

                {/* Graduation Tassel */}
                <path
                  d="M49 32L79 36V53"
                  stroke="#FBBF24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path d="M79 49L74 61H84L79 49Z" fill="#FBBF24" />

                {/* Rear Scholarship Coin */}
                <circle
                  cx="260"
                  cy="180"
                  r="27"
                  fill="#F59E0B"
                  stroke="#FDE68A"
                  strokeWidth="4"
                />

                {/* Main Scholarship Coin */}
                <circle
                  cx="290"
                  cy="163"
                  r="37"
                  fill="#FBBF24"
                  stroke="#FDE68A"
                  strokeWidth="5"
                />

                <circle
                  cx="290"
                  cy="163"
                  r="27"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />

                {/* Rupee Symbol Using SVG Paths */}
                <path
                  d="M276 147H304
               M276 155H304
               M276 147H286
               C306 147 306 170 276 170
               L300 184"
                  stroke="#92400E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Floating Scholarship Success Card */}
                <rect
                  x="10"
                  y="143"
                  width="65"
                  height="62"
                  rx="13"
                  fill="white"
                />

                <circle cx="42.5" cy="174" r="22" fill="#DCFCE7" />

                <circle cx="42.5" cy="174" r="16" fill="#22C55E" />

                <path
                  d="M34 174L40 180L51 168"
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

            {/* Golden Decorative Stars */}
            <path
              d="M190 8L193 16L201 19L193 22L190 30L187 22L179 19L187 16Z"
              fill="#FDE68A"
            />

            {/* Decorative Dots */}
            <circle cx="215" cy="13" r="4" fill="#A5B4FC" />
            <circle cx="20" cy="92" r="3" fill="#C7D2FE" />
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
              to="/admin/scholarships"
            >
              {title}
            </Link>
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "categories" ? "bg-white shadow text-indigo-700" : "text-slate-600"}`}
              aria-current={tab === "categories" ? "page" : undefined}
              to="/admin/scholarships/categories"
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
                  setQuery(e.target.value);
                }}
              />
            </div>
            <select
              className="field max-w-56"
              aria-label="Category filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option
                  key={c._id || c.scholarshipType}
                  value={c.scholarshipType}
                >
                  {c.title}
                </option>
              ))}
            </select>
          </div>
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
                    <span>{index + 1}</span>
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
                      : row.scholarshipType}
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
      </div>
      {editing &&
        (editing.category ? (
          <AddEditScholarshipCategory
            item={editing.item}
            onClose={() => setEditing(undefined)}
            onSaved={() => {
              setEditing(undefined);
              setNotice("Category saved successfully");
              refresh();
            }}
          />
        ) : (
          <AddEditScholarship
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
        <SingleScholarship
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
