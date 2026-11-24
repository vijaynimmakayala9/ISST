import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { entranceExamApi } from "./entranceExamApi";
import { errorText } from "../../api/axiosInstance";

export default function AddEditEntranceExam({
  categories,
  levels,
  item,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...{
      categoryId: categories[0]?._id || "",
      name: "",
      fullName: "",
      conductedBy: "",
      tag: "",
      description: "",
      eligibility: "",
      mode: "",
      examDate: "",
      website: "",
      subjects: [],
      targets: [{ level: "", course: "", branch: "" }],
    },
    ...item,
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const change = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const setTargets = (targets) => change("targets", targets);
  const updateTarget = (i, key, v) =>
    setTargets(
      (form.targets || []).map((t, j) =>
        j === i
          ? {
              ...t,
              [key]: v,
              ...(key === "level"
                ? { course: "", branch: "" }
                : key === "course"
                  ? { branch: "" }
                  : {}),
            }
          : t,
      ),
    );
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const targets = (form.targets || []).map(({ level, course, branch }) => ({
        level,
        ...(course ? { course } : {}),
        ...(branch ? { branch } : {}),
      }));
      if (
        targets.some((target) => !target.level) ||
        new Set(targets.map((target) => JSON.stringify(target))).size !==
          targets.length
      )
        throw Error(
          "Select an education level for every target and remove duplicates.",
        );
      const payload = {
        categoryId: form.categoryId?.trim() || "",
        name: form.name?.trim() || "",
        fullName: form.fullName?.trim() || "",
        conductedBy: form.conductedBy?.trim() || "",
        tag: form.tag?.trim() || "",
        description: form.description?.trim() || "",
        eligibility: form.eligibility?.trim() || "",
        mode: form.mode?.trim() || "",
        examDate: form.examDate?.trim() || "",
        website: form.website?.trim() || "",
        subjects: (form.subjects || [])
          .map((value) => value.trim())
          .filter(Boolean),
        targets,
      };
      if (!targets.length) throw Error("Add at least one education target.");
      if (!payload.name) throw Error("Name is required.");
      if (!payload.fullName) throw Error("Full name is required.");
      if (!payload.conductedBy) throw Error("Conducted by is required.");
      if (!payload.tag) throw Error("Tag is required.");
      if (!payload.description) throw Error("Description is required.");
      if (!payload.eligibility) throw Error("Eligibility is required.");
      if (!payload.mode) throw Error("Mode is required.");
      if (!payload.examDate) throw Error("Exam date is required.");
      if (item) payload.examId = item._id;
      await (item ? entranceExamApi.update : entranceExamApi.create)(payload);
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
            {item ? "Edit" : "Add"} entrance exam
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
        <form className="space-y-5 p-4 sm:p-6" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Exam category *
              <select
                className="field mt-2"
                required
                value={form.categoryId ?? ""}
                onChange={(event) => change("categoryId", event.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Name *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.name ?? ""}
                onChange={(event) => change("name", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Full name *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.fullName ?? ""}
                onChange={(event) => change("fullName", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Conducted by *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.conductedBy ?? ""}
                onChange={(event) => change("conductedBy", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Tag *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.tag ?? ""}
                onChange={(event) => change("tag", event.target.value)}
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
            <label className="block text-sm font-semibold sm:col-span-2">
              Eligibility *
              <textarea
                className="field mt-2"
                rows={4}
                required
                value={form.eligibility ?? ""}
                onChange={(event) => change("eligibility", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Mode *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.mode ?? ""}
                onChange={(event) => change("mode", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Exam date *
              <input
                className="field mt-2"
                type="text"
                required
                value={form.examDate ?? ""}
                onChange={(event) => change("examDate", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Website
              <input
                className="field mt-2"
                type="url"
                value={form.website ?? ""}
                onChange={(event) => change("website", event.target.value)}
              />
            </label>
          </div>

          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <b className="text-sm">Audience targets *</b>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setTargets([
                    ...(form.targets || []),
                    { level: "", course: "", branch: "" },
                  ])
                }
              >
                <Plus size={15} />
                Add target
              </button>
            </div>
            {(form.targets || []).map((t, i) => {
              const level = levels.find((x) => x.name === t.level);
              const course = level?.courses?.find((x) => x.name === t.course);
              return (
                <div
                  key={i}
                  className="grid sm:grid-cols-4 gap-2 bg-indigo-50 p-3 rounded-xl"
                >
                  <select
                    className="field"
                    required
                    aria-label="Education level"
                    value={t.level || ""}
                    onChange={(e) => updateTarget(i, "level", e.target.value)}
                  >
                    <option value="">Education level</option>
                    {levels.map((l) => (
                      <option key={l._id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="field"
                    aria-label="Course"
                    disabled={!t.level}
                    value={t.course || ""}
                    onChange={(e) => updateTarget(i, "course", e.target.value)}
                  >
                    <option value="">All courses</option>
                    {level?.courses?.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="field"
                    aria-label="Branch"
                    disabled={!t.course}
                    value={t.branch || ""}
                    onChange={(e) => updateTarget(i, "branch", e.target.value)}
                  >
                    <option value="">All branches</option>
                    {course?.branches?.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-secondary"
                    aria-label="Remove target"
                    onClick={() =>
                      setTargets((form.targets || []).filter((_, j) => j !== i))
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </section>
          <fieldset className="space-y-2 rounded-xl border border-indigo-100 p-3">
            <legend className="px-1 text-sm font-semibold">
              Exam subjects
            </legend>
            {(form.subjects || []).map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="field"
                  aria-label={`Subject ${index + 1}`}
                  required
                  value={value}
                  onChange={(event) =>
                    change(
                      "subjects",
                      form.subjects.map((entry, i) =>
                        i === index ? event.target.value : entry,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Remove subject"
                  onClick={() =>
                    change(
                      "subjects",
                      form.subjects.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => change("subjects", [...(form.subjects || []), ""])}
            >
              <Plus size={16} /> Add subject
            </button>
          </fieldset>
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
