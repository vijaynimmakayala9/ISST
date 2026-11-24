import React, { useState } from "react";
import { X } from "lucide-react";
import { config, create, update } from "./educationLevelsApi";
import { errorText } from "../../api/axiosInstance";
const numeric = ["salaryMin", "salaryMax", "feesMin", "feesMax", "rating"];
const empty = () =>
  Object.fromEntries(
    [...config.fields, ...(config.lists || [])].map((k) => [
      k,
      config.lists?.includes(k) ? [] : k === "isActive" ? true : "",
    ]),
  );
export default function AddEditEducationLevel({ item, onClose, onSaved }) {
  const [data, setData] = useState(() =>
    item ? { ...empty(), ...item } : empty(),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const isEdit = Boolean(item);
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const payload = {};
      for (const k of config.fields) {
        if (data[k] !== "" && data[k] !== undefined)
          payload[k] = numeric.includes(k) ? Number(data[k]) : data[k];
      }
      for (const k of config.lists || [])
        payload[k] = (data[k] || [])
          .map((value) => value.trim())
          .filter(Boolean);

      if (config.nested && !isEdit) payload.courses = data.courses || [];
      if (isEdit) payload[config.key] = item._id;
      await (isEdit ? update : create)(payload);
      onSaved();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 p-3 md:p-8 flex items-center justify-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Editor · ${config.title}`}
        className="bg-white rounded-3xl border border-indigo-200 w-full max-w-3xl max-h-[94dvh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-white z-10 flex justify-between items-center border-b border-indigo-100 p-5">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit" : "Create"} {config.title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            disabled={busy}
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4">
            <label className="text-sm font-medium">
              Name *
              <input
                className="field mt-2"
                value={data.name ?? ""}
                required
                onChange={(event) => set("name", event.target.value)}
              />
            </label>
          </div>

          <section className="space-y-3">
            <b>Courses and branches</b>
            <p className="text-xs text-slate-500">
              Manage existing courses and branches in the dedicated section
              below the education levels table.
            </p>
            {!isEdit && (
              <textarea
                className="field"
                rows="3"
                placeholder="Optional initial courses, one per line (without branches)"
                onChange={(e) =>
                  set(
                    "courses",
                    e.target.value
                      .split("\n")
                      .filter(Boolean)
                      .map((name) => ({ name, branches: [] })),
                  )
                }
              />
            )}
          </section>

          {error && (
            <div
              role="alert"
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
            >
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn-secondary"
              disabled={busy}
              onClick={onClose}
            >
              Cancel
            </button>
            <button disabled={busy} className="btn-primary">
              {busy ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
