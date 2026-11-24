import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { list, remove as deleteRecord } from "./bannersApi";
import { errorText } from "../../api/axiosInstance";
import SingleBanner from "./SingleBanner";
import AddEditBanner from "./AddEditBanner";

const isImageUrl = (value, key = "") =>
  typeof value === "string" &&
  /^https?:\/\//i.test(value) &&
  (/image|logo|thumbnail|photo|poster|avatar|banner/i.test(key) ||
    /\.(png|jpe?g|webp|gif|avif|svg)(?:[?#]|$)/i.test(value) ||
    /res\.cloudinary\.com\/.+\/image\/upload\//i.test(value));
const getRecordImage = (item = {}) =>
  [
    "imageUrl",
    "image",
    "bannerImage",
    "thumbnailUrl",
    "thumbnail",
    "coverImage",
    "logo",
    "photoUrl",
  ]
    .map((key) => (isImageUrl(item[key], key) ? item[key] : null))
    .find(Boolean) || null;
function ImagePreview({ src, alt = "Uploaded image", compact = false }) {
  const [failed, setFailed] = useState(false);
  if (!src)
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50 text-indigo-300 ${compact ? "h-12 w-14" : "h-40 w-full"}`}
      >
        <ImageIcon size={compact ? 18 : 34} />
      </div>
    );
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-indigo-100 bg-slate-50 ${compact ? "h-14 w-16 shrink-0" : "w-full max-w-lg"}`}
    >
      {failed ? (
        <div className="flex h-20 items-center justify-center text-xs text-slate-500">
          Preview unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`block w-full object-cover ${compact ? "h-full" : "max-h-72 min-h-28"}`}
        />
      )}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open full image"
        className="absolute bottom-1 right-1 rounded-lg bg-white/90 p-1.5 text-indigo-700 opacity-90 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
      >
        <ExternalLink size={compact ? 12 : 16} />
      </a>
    </div>
  );
}

export default function AllBanners() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await list(page);
      setRows(result.rows);
      setTotal(result.total);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  const filtered = rows.filter((r) =>
    JSON.stringify([r.title, r.name, r.description, r.city, r.state])
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const [pendingDelete, setPendingDelete] = useState(null);
  async function remove(item) {
    setBusyId(item._id);
    try {
      await deleteRecord(item._id);
      setPendingDelete(null);
      setNotice("Deleted successfully");
      await load();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusyId(null);
    }
  }
  return (
    <>
      <div className="relative isolate mb-7 flex min-h-[200px] w-full items-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#312E81] via-[#4338CA] to-[#6366F1] px-5 py-6 text-white shadow-lg shadow-indigo-200 sm:px-8">
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

        {/* Banner Management SVG Illustration */}
        <div className="pointer-events-none absolute inset-y-0 right-6 hidden w-[280px] items-center justify-center md:flex lg:right-12 lg:w-[340px]">
          <svg
            viewBox="0 0 340 220"
            className="h-auto max-h-[190px] w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Background Rings */}
            <circle
              cx="185"
              cy="110"
              r="103"
              stroke="white"
              strokeOpacity="0.15"
            />

            <circle cx="185" cy="110" r="85" fill="white" fillOpacity="0.06" />

            {/* Rear Banner Card */}
            <g transform="rotate(9 190 100)">
              <rect
                x="85"
                y="25"
                width="215"
                height="145"
                rx="14"
                fill="#A5B4FC"
              />

              <rect
                x="96"
                y="36"
                width="193"
                height="105"
                rx="8"
                fill="#C7D2FE"
              />
            </g>

            {/* Main Banner Card */}
            <rect
              x="38"
              y="49"
              width="240"
              height="150"
              rx="14"
              fill="#FFFFFF"
            />

            {/* Image Background */}
            <rect
              x="49"
              y="60"
              width="218"
              height="103"
              rx="8"
              fill="#C7D2FE"
            />

            {/* Sun */}
            <circle cx="224" cy="85" r="15" fill="#FDE68A" />

            {/* Mountain Illustration */}
            <path
              d="M49 163L105 96L150 139L185 110L267 163H49Z"
              fill="#6366F1"
            />

            <path d="M49 163L88 126L130 163H49Z" fill="#818CF8" />

            <path d="M105 96L91 113L105 109L116 115Z" fill="#EEF2FF" />

            {/* Image Card Details */}
            <rect
              x="50"
              y="174"
              width="90"
              height="7"
              rx="3.5"
              fill="#A5B4FC"
            />

            <rect x="50" y="186" width="65" height="4" rx="2" fill="#E0E7FF" />

            <rect
              x="223"
              y="174"
              width="43"
              height="15"
              rx="5"
              fill="#EEF2FF"
            />

            {/* Floating Add Banner Card */}
            <rect
              x="256"
              y="132"
              width="64"
              height="64"
              rx="15"
              fill="#FFFFFF"
            />

            <rect
              x="266"
              y="142"
              width="44"
              height="44"
              rx="11"
              fill="#EEF2FF"
            />

            <path
              d="M288 151V177M275 164H301"
              stroke="#6366F1"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Floating Gallery Icon */}
            <rect x="12" y="18" width="58" height="54" rx="12" fill="#FFFFFF" />

            <rect
              x="24"
              y="29"
              width="34"
              height="30"
              rx="5"
              stroke="#6366F1"
              strokeWidth="2.5"
            />

            <circle cx="34" cy="38" r="3.5" fill="#818CF8" />

            <path
              d="M24 54L35 44L43 51L50 43L58 54"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Decorative Sparkles */}
            <path
              d="M305 25V39M298 32H312M18 119V133M11 126H25"
              stroke="#C7D2FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <circle cx="115" cy="15" r="4" fill="#A5B4FC" />
            <circle cx="320" cy="100" r="3" fill="#C7D2FE" />
            <circle cx="24" cy="185" r="4" fill="#A5B4FC" />
          </svg>
        </div>

        {/* Banner Section Content */}
        <div className="relative z-10 w-full min-w-0 md:max-w-[60%]">
          {/* Section Label */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-300" />

            <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100">
              ISST · Content Management
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Banners
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
            Manage and organize banners
          </p>

          {/* Add New Button */}
          <button
            type="button"
            onClick={() => {
              setEdit(null);
              setShow(true);
            }}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#4338CA] shadow-md transition-all duration-200 hover:bg-indigo-50 active:scale-95"
          >
            <Plus size={18} />
            Add new
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <div className="relative w-full sm:w-80 max-w-full">
            <Search
              aria-hidden="true"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 z-10"
            />
            <input
              type="search"
              aria-label="Search current page"
              placeholder="Search current page"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block h-12 w-full min-w-0 rounded-xl border border-indigo-200 bg-white !pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <button className="btn-secondary" onClick={load}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
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
                {["Record", "Description", "Created", "Actions"].map((x) => (
                  <th scope="col" role="columnheader" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {(loading ? [] : filtered).map((item, index) => (
                <tr role="row" key={item._id}>
                  <td
                    role="cell"
                    data-label="S.No."
                    className="record-table-number"
                  >
                    <span>{(page - 1) * 20 + index + 1}</span>
                  </td>
                  <td
                    role="cell"
                    data-label="Record"
                    className="record-table-primary"
                  >
                    <div className="flex items-center gap-3">
                      {getRecordImage(item) && (
                        <ImagePreview
                          src={getRecordImage(item)}
                          alt={item.title || item.name || "Image"}
                          compact
                        />
                      )}
                      <div className="min-w-0">
                        <div className="break-words font-bold text-slate-800">
                          {item.title || item.name || "Untitled"}
                        </div>
                        {item.tag && (
                          <span className="mt-1 inline-block rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                            {item.tag}
                          </span>
                        )}
                        {typeof item.isActive === "boolean" && (
                          <span
                            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${item.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    role="cell"
                    data-label="Description"
                    className="record-table-description"
                  >
                    <p className="record-table-summary">
                      {item.description ||
                        item.city ||
                        `${item.courses?.length || 0} courses`}
                    </p>
                  </td>
                  <td
                    role="cell"
                    data-label="Created"
                    className="record-table-date"
                  >
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td
                    role="cell"
                    data-label="Actions"
                    className="record-table-actions"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        title="View details"
                        aria-label="View details"
                        className="rounded-xl border border-indigo-200 bg-indigo-50 p-2.5 text-indigo-700 transition hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        onClick={() => setViewItem(item)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        aria-label="Edit"
                        className="rounded-xl border border-indigo-200 bg-indigo-50 p-2.5 text-indigo-700 transition hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        onClick={() => {
                          setEdit(item);
                          setShow(true);
                        }}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label="Delete"
                        disabled={busyId === item._id}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-rose-500"
                        onClick={() => setPendingDelete(item)}
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
        {!loading && !filtered.length && (
          <p className="text-center text-slate-400 py-12">No records found</p>
        )}
        {loading && (
          <p className="text-center text-slate-400 py-12">Loading records...</p>
        )}
        {
          <div className="flex items-center justify-between mt-5 text-sm">
            <span className="text-slate-500">
              Page {page} · {total} total
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="btn-secondary"
                disabled={page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        }
      </div>
      {viewItem && (
        <SingleBanner
          item={viewItem}
          onClose={() => setViewItem(null)}
          onEdit={(record) => {
            setViewItem(null);
            setEdit(record);
            setShow(true);
          }}
        />
      )}
      {show && (
        <AddEditBanner
          key={edit ? edit._id : "new"}
          item={edit}
          onClose={() => setShow(false)}
          onSaved={() => {
            setShow(false);
            setNotice("Saved successfully");
            load();
          }}
        />
      )}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm deletion"
            className="panel w-full max-w-md"
          >
            <h2 className="text-lg font-bold">
              Delete {pendingDelete.title || pendingDelete.name}?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This action is permanent.
            </p>
            {error && (
              <p role="alert" className="mt-3 text-red-700">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="btn-secondary"
                disabled={Boolean(busyId)}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                disabled={Boolean(busyId)}
                onClick={() => remove(pendingDelete)}
              >
                {busyId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
