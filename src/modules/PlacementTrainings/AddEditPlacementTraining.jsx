import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { placementTrainingApi } from "./placementTrainingApi";
import { errorText } from "../../api/axiosInstance";

export default function AddEditPlacementTraining({
  categories,
  levels,
  item,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...{
      categoryId: categories[0]?._id || "",
      title: "",
      description: "",
      tag: "",
      body: "",
      thumbnail: "",
      videoUrl: "",
      keyPoints: [],
      steps: [],
      targets: [],
    },
    ...item,
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [videoError, setVideoError] = useState("");
  function changeFile(selected) {
    setFile(null);
    setVideoError("");
    if (!selected) return;
    if (!/\.(mp4|mkv|mov|avi|webm|flv|wmv)$/i.test(selected.name)) {
      setVideoError("Choose an MP4, MKV, MOV, AVI, WebM, FLV, or WMV file.");
      return;
    }
    if (selected.size > 100 * 1024 * 1024) {
      setVideoError("Video files must be 100 MB or smaller.");
      return;
    }
    setFile(selected);
  }
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
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
    if (busy || videoError) return;
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
        title: form.title?.trim() || "",
        description: form.description?.trim() || "",
        tag: form.tag?.trim() || "",
        body: form.body?.trim() || "",
        thumbnail: form.thumbnail?.trim() || null,
        ...(!file && (!item || (form.videoUrl || "") !== (item.videoUrl || ""))
          ? { videoUrl: form.videoUrl?.trim() || null }
          : {}),
        keyPoints: (form.keyPoints || [])
          .map((value) => value.trim())
          .filter(Boolean),
        steps: (form.steps || []).map((value) => value.trim()).filter(Boolean),
        targets,
      };
      if (!payload.title) throw Error("Title is required.");
      if (!payload.description) throw Error("Description is required.");
      if (!payload.tag) throw Error("Tag is required.");
      if (!payload.body) throw Error("Article body is required.");
      if (item) payload.trainingId = item._id;
      await (item ? placementTrainingApi.update : placementTrainingApi.create)(
        payload,
        file,
      );
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
            {item ? "Edit" : "Add"} placement training
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
              Placement category *
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
              Article body *
              <textarea
                className="field mt-2"
                rows={4}
                required
                value={form.body ?? ""}
                onChange={(event) => change("body", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Thumbnail URL
              <input
                className="field mt-2"
                type="url"
                value={form.thumbnail ?? ""}
                onChange={(event) => change("thumbnail", event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold">
              Video URL
              <input
                className="field mt-2"
                type="url"
                value={form.videoUrl ?? ""}
                onChange={(event) => change("videoUrl", event.target.value)}
              />
            </label>
          </div>
          <section className="space-y-3 rounded-xl border border-indigo-100 p-3">
            {form.thumbnail && /^https?:\/\//i.test(form.thumbnail) && (
              <img
                className="max-h-40 rounded-lg object-contain"
                src={form.thumbnail}
                alt="Thumbnail preview"
              />
            )}
            <label className="block text-sm font-semibold">
              Video file (up to 100 MB)
              <input
                className="field mt-2"
                type="file"
                ref={fileInput}
                accept=".mp4,.mkv,.mov,.avi,.webm,.flv,.wmv"
                onChange={(event) =>
                  changeFile(event.target.files?.[0] || null)
                }
              />
            </label>
            {(form.videoUrl || file) && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setFile(null);
                  setVideoError("");
                  change("videoUrl", "");
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                Remove video
              </button>
            )}
            {videoError && (
              <p role="alert" className="text-sm text-red-700">
                {videoError}
              </p>
            )}
            {preview || /^https?:\/\//i.test(form.videoUrl || "") ? (
              <>
                {(preview ||
                  /\.(mp4|mkv|mov|avi|webm|flv|wmv)(?:[?#]|$)/i.test(
                    form.videoUrl,
                  )) && (
                  <video
                    className="max-h-64 w-full rounded-xl bg-slate-900"
                    controls
                    preload="metadata"
                    src={preview || form.videoUrl}
                  />
                )}
                {!preview && (
                  <a
                    className="btn-secondary"
                    href={form.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open video
                  </a>
                )}
              </>
            ) : null}
          </section>
          <section className="space-y-3">
            <div className="flex justify-between items-center">
              <b className="text-sm">Audience targets (optional)</b>
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
            <legend className="px-1 text-sm font-semibold">Key points</legend>
            {(form.keyPoints || []).map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="field"
                  aria-label={`Key point ${index + 1}`}
                  required
                  value={value}
                  onChange={(event) =>
                    change(
                      "keyPoints",
                      form.keyPoints.map((entry, i) =>
                        i === index ? event.target.value : entry,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Remove key point"
                  onClick={() =>
                    change(
                      "keyPoints",
                      form.keyPoints.filter((_, i) => i !== index),
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
              onClick={() =>
                change("keyPoints", [...(form.keyPoints || []), ""])
              }
            >
              <Plus size={16} /> Add key point
            </button>
          </fieldset>
          <fieldset className="space-y-2 rounded-xl border border-indigo-100 p-3">
            <legend className="px-1 text-sm font-semibold">
              Training steps
            </legend>
            {(form.steps || []).map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="field"
                  aria-label={`Step ${index + 1}`}
                  required
                  value={value}
                  onChange={(event) =>
                    change(
                      "steps",
                      form.steps.map((entry, i) =>
                        i === index ? event.target.value : entry,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Remove step"
                  onClick={() =>
                    change(
                      "steps",
                      form.steps.filter((_, i) => i !== index),
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
              onClick={() => change("steps", [...(form.steps || []), ""])}
            >
              <Plus size={16} /> Add step
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
