import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { config, create, update, makePayload } from "./skillDevelopmentApi";
import { errorText } from "../../api/axiosInstance";
import { list as listEducationLevels } from "../EducationLevels/educationLevelsApi";
const numeric = ["salaryMin", "salaryMax", "feesMin", "feesMax", "rating"];
const empty = () =>
  Object.fromEntries(
    [...config.fields, ...(config.lists || [])].map((k) => [
      k,
      config.lists?.includes(k) ? [] : k === "isActive" ? true : "",
    ]),
  );
export default function AddEditSkillCourse({ item, onClose, onSaved }) {
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
  const [levels, setLevels] = useState([]);
  useEffect(() => {
    listEducationLevels()
      .then((r) => setLevels(r.rows))
      .catch((e) => setError(errorText(e)));
  }, []);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));
  const setTargets = (targets) => set("targets", targets);
  const updateTarget = (i, key, v) =>
    setTargets(
      (data.targets || []).map((t, j) =>
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
      if (!data.targets?.length || data.targets.some((t) => !t.level))
        throw Error("At least one valid audience target is required");
      if (
        new Set(
          data.targets.map(({ level, course, branch }) =>
            JSON.stringify([level, course || "", branch || ""]),
          ),
        ).size !== data.targets.length
      )
        throw Error("Remove duplicate education targets");
      payload.targets = data.targets.map((t) => ({
        level: t.level,
        ...(t.course ? { course: t.course } : {}),
        ...(t.branch ? { branch: t.branch } : {}),
      }));

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
              Description *
              <textarea
                className="field mt-2"
                value={data.description ?? ""}
                required
                onChange={(event) => set("description", event.target.value)}
                rows={3}
              />
            </label>
            <label className="text-sm font-medium">
              Course category *
              <input
                className="field mt-2"
                value={data.courseCategory ?? ""}
                required
                onChange={(event) => set("courseCategory", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Course level *
              <input
                className="field mt-2"
                value={data.courseLevel ?? ""}
                required
                onChange={(event) => set("courseLevel", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Course type *
              <input
                className="field mt-2"
                value={data.courseType ?? ""}
                required
                onChange={(event) => set("courseType", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Duration *
              <input
                className="field mt-2"
                value={data.duration ?? ""}
                required
                onChange={(event) => set("duration", event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Video URL
              <input
                className="field mt-2"
                value={data.videoUrl ?? ""}
                onChange={(event) => set("videoUrl", event.target.value)}
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
                    ...(data.targets || []),
                    { level: "", course: "", branch: "" },
                  ])
                }
              >
                <Plus size={15} />
                Add target
              </button>
            </div>
            {(data.targets || []).map((t, i) => {
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
                      setTargets((data.targets || []).filter((_, j) => j !== i))
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
              What you will learn
            </legend>
            {(data.whatYouWillLearn || []).map((entry, index) => (
              <div className="flex gap-2" key={index}>
                <input
                  className="field"
                  aria-label={`Learning Outcome ${index + 1}`}
                  value={entry}
                  onChange={(event) =>
                    set(
                      "whatYouWillLearn",
                      data.whatYouWillLearn.map((value, i) =>
                        i === index ? event.target.value : value,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Remove learning outcome"
                  onClick={() =>
                    set(
                      "whatYouWillLearn",
                      data.whatYouWillLearn.filter((_, i) => i !== index),
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
                set("whatYouWillLearn", [...(data.whatYouWillLearn || []), ""])
              }
            >
              <Plus size={16} /> Add learning outcome
            </button>
          </fieldset>
          <fieldset className="space-y-2 rounded-xl border border-indigo-100 p-3">
            <legend className="px-1 text-sm font-semibold">Key points</legend>
            {(data.keyPoints || []).map((entry, index) => (
              <div className="flex gap-2" key={index}>
                <input
                  className="field"
                  aria-label={`Key Point ${index + 1}`}
                  value={entry}
                  onChange={(event) =>
                    set(
                      "keyPoints",
                      data.keyPoints.map((value, i) =>
                        i === index ? event.target.value : value,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Remove key point"
                  onClick={() =>
                    set(
                      "keyPoints",
                      data.keyPoints.filter((_, i) => i !== index),
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
              onClick={() => set("keyPoints", [...(data.keyPoints || []), ""])}
            >
              <Plus size={16} /> Add key point
            </button>
          </fieldset>

          <label className="block text-sm font-medium">
            Video (optional)
            <input
              className="field mt-2"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          {(preview || data.videoUrl) &&
            (/^https?:\/\//i.test(data.videoUrl || "") &&
            !preview &&
            !/\.(mp4|webm|mov)(?:[?#]|$)/i.test(data.videoUrl) ? (
              <a
                className="btn-secondary"
                href={data.videoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open video
              </a>
            ) : (
              <video
                className="max-h-72 w-full rounded-xl"
                controls
                preload="metadata"
                src={preview || data.videoUrl}
              />
            ))}
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
