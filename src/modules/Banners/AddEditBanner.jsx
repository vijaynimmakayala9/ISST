import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { config, create, update, makePayload } from "./bannersApi";
import { errorText } from "../../api/axiosInstance";
const numeric = ["salaryMin", "salaryMax", "feesMin", "feesMax", "rating"];
const empty = () =>
  Object.fromEntries(
    [...config.fields, ...(config.lists || [])].map((k) => [
      k,
      config.lists?.includes(k) ? [] : k === "isActive" ? true : "",
    ]),
  );
export default function AddEditBanner({ item, onClose, onSaved }) {
  const [data, setData] = useState(() =>
    item ? { ...empty(), ...item } : empty(),
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
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

      if (isEdit) payload[config.key] = item._id;
      await (isEdit ? update : create)(makePayload(payload, file));
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
              Title *
              <input
                className="field mt-2"
                value={data.title ?? ""}
                required
                onChange={(event) => set("title", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Description
              <textarea
                className="field mt-2"
                value={data.description ?? ""}
                onChange={(event) => set("description", event.target.value)}
                rows={3}
              />
            </label>
            <label className="text-sm font-medium">
              Image URL
              <input
                className="field mt-2"
                value={data.imageUrl ?? ""}
                onChange={(event) => set("imageUrl", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Is active
              <select
                className="field mt-2"
                value={String(data.isActive ?? true)}
                onChange={(event) =>
                  set("isActive", event.target.value === "true")
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
            <p className="mb-3 text-sm font-bold text-indigo-800">
              Banner image preview
            </p>
            {(preview || data.imageUrl || data.image) && (
              <img
                className="max-h-72 rounded-xl object-contain"
                src={preview || data.imageUrl || data.image}
                alt="Banner preview"
              />
            )}
          </div>
          <label className="block text-sm font-medium">
            Banner image (optional)
            <input
              className="field mt-2"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
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
