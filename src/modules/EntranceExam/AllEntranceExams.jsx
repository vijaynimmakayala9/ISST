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
      <div
        className={`section-hero ${tab === "categories" ? "hero-entrance-exams-categories" : "hero-entrance-exams"} flex flex-wrap justify-between items-end gap-3`}
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            {tab === "categories" ? "Exam Categories" : title}
          </h1>
          <p className="mt-1 text-indigo-100">
            {tab === "categories"
              ? "Create and organize categories."
              : `Manage ${title.toLowerCase()}.`}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() =>
            setEditing({ category: tab === "categories", item: null })
          }
        >
          <Plus size={17} />
          {tab === "categories" ? "Add category" : "Add entrance exam"}
        </button>
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
