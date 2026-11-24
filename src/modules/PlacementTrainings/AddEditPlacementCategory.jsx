import React, { useState } from "react";
import { X } from "lucide-react";
import { placementTrainingApi } from "./placementTrainingApi";
import { errorText } from "../../api/axiosInstance";

export default function AddEditPlacementCategory({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item?.title || "",
    description: item?.description || "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const change = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      };
      if (!payload.title || !payload.description)
        throw Error("Provide a title and description.");
      if (item) payload.categoryId = item._id;
      await (
        item
          ? placementTrainingApi.updateCategory
          : placementTrainingApi.createCategory
      )(payload);
      onSaved();
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-3 sm:p-6"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
        className="max-h-[92dvh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 bg-white p-4 sm:px-6">
          <h2 id="editor-title" className="text-xl font-bold">
            {item ? "Edit category" : "Add category"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="btn-secondary !p-2"
            disabled={busy}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <form className="space-y-4 p-4 sm:p-6" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            Title *
            <input
              className="field mt-2"
              type="text"
              required
              value={form.title ?? ""}
              onChange={(event) => change("title", event.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold sm:col-span-2">
            Description *
            <textarea
              className="field mt-2"
              rows={4}
              required
              value={form.description ?? ""}
              onChange={(event) => change("description", event.target.value)}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              disabled={busy}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
