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
} from "lucide-react";
import { list, remove as deleteRecord } from "./educationLevelsApi";
import { errorText } from "../../api/axiosInstance";
import SingleEducationLevel from "./SingleEducationLevel";
import AddEditEducationLevel from "./AddEditEducationLevel";
import CourseManager from "./components/CourseManager";

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

export default function AllEducationLevels() {
  const [levelId, setLevelId] = useState("");
  const [rows, setRows] = useState([]);
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
      const result = await list();
      setRows(result.rows);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
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
      <div className="section-hero hero-education-levels flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="text-3xl font-bold">{"Education Levels"}</h1>
          <p className="text-indigo-100 mt-2">
            Manage and organize education levels
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEdit(null);
            setShow(true);
          }}
        >
          <Plus size={18} />
          Add new
        </button>
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
                    <span>{index + 1}</span>
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
                      <a
                        className="btn-secondary whitespace-nowrap"
                        href="#education-courses"
                        onClick={() => setLevelId(item._id)}
                      >
                        Manage courses
                      </a>
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
      </div>
      <CourseManager
        key={levelId}
        levels={rows}
        levelId={levelId}
        onSelectLevel={setLevelId}
        onChanged={load}
      />
      {viewItem && (
        <SingleEducationLevel
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
        <AddEditEducationLevel
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
