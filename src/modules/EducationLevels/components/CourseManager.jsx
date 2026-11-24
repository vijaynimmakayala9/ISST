import React, { useState } from "react";
import { mutateNested } from "../educationLevelsApi";
import { errorText } from "../../../api/axiosInstance";

export default function CourseManager({
  levels,
  levelId,
  onSelectLevel,
  onChanged,
}) {
  const level = levels.find((entry) => entry._id === levelId);
  const [action, setAction] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function open(method, courseName, branchName, kind = "course") {
    setAction({
      method,
      courseName,
      branchName,
      kind,
      levelId: level._id,
      levelName: level.name,
    });
    setName(method === "patch" ? (branchName ?? courseName) : "");
    setError("");
    setNotice("");
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const { method, kind, courseName, branchName } = action;
    const nextName = name.trim();
    if (method !== "delete" && !nextName) {
      setError(`Enter a ${kind} name.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const body = { levelId: action.levelId };
      if (courseName !== undefined) body.courseName = courseName;
      if (branchName !== undefined) body.branchName = branchName;
      if (method !== "delete") body.name = nextName;
      if (kind === "course" && method === "post") body.branches = [];
      await mutateNested(
        kind === "course" ? "courses" : "branches",
        method,
        body,
      );
      await onChanged();
      setAction(null);
      setNotice(
        `${kind === "course" ? "Course" : "Branch"} ${method === "delete" ? "deleted" : "saved"}.`,
      );
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }

  const deleting = action?.method === "delete";
  const title =
    action &&
    `${deleting ? "Delete" : action.method === "patch" ? "Edit" : "Add"} ${action.kind}`;

  return (
    <section
      id="education-courses"
      className="panel mt-6 scroll-mt-6 space-y-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Manage Courses &amp; Branches</h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose a level. Open a course to manage its branches.
          </p>
        </div>
        {level && (
          <button className="btn-primary" onClick={() => open("post")}>
            Add course
          </button>
        )}
      </div>
      <label className="block max-w-sm text-sm font-semibold">
        Education level
        <select
          className="field mt-1"
          value={level?._id ?? ""}
          onChange={(event) => {
            setNotice("");
            onSelectLevel(event.target.value);
          }}
        >
          <option value="">Select an education level</option>
          {levels.map((entry) => (
            <option key={entry._id} value={entry._id}>
              {entry.name}
            </option>
          ))}
        </select>
      </label>
      {notice && (
        <p role="status" className="text-sm text-emerald-700">
          {notice}
        </p>
      )}
      {level && !level.courses?.length && (
        <p className="rounded-xl bg-indigo-50 p-4 text-sm">
          No courses yet. Select Add course to create one.
        </p>
      )}
      {level?.courses?.map((course) => (
        <details
          key={JSON.stringify([level._id, course.name])}
          className="rounded-xl border border-indigo-200"
        >
          <summary className="cursor-pointer rounded-xl bg-indigo-50 px-4 py-3 font-semibold">
            {course.name}{" "}
            <span className="ml-2 text-sm font-normal text-slate-600">
              ({course.branches?.length ?? 0} branches)
            </span>
          </summary>
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                className="btn-primary"
                onClick={() => open("post", course.name, undefined, "branch")}
              >
                Add branch
              </button>
              <button
                className="btn-secondary"
                onClick={() => open("patch", course.name)}
              >
                Edit course
              </button>
              <button
                className="btn-secondary !text-red-700"
                onClick={() => open("delete", course.name)}
              >
                Delete course
              </button>
            </div>
            {!course.branches?.length && (
              <p className="text-sm text-slate-600">No branches yet.</p>
            )}
            {Boolean(course.branches?.length) && (
              <ul className="divide-y divide-indigo-100 rounded-xl border border-indigo-100">
                {course.branches.map((branch) => (
                  <li
                    key={branch.name}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
                  >
                    <span className="min-w-0 break-words text-sm font-medium">
                      {branch.name}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn-secondary"
                        aria-label={`Edit branch ${branch.name}`}
                        onClick={() =>
                          open("patch", course.name, branch.name, "branch")
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary !text-red-700"
                        aria-label={`Delete branch ${branch.name}`}
                        onClick={() =>
                          open("delete", course.name, branch.name, "branch")
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
      {action && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <form
            role={deleting ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby="course-action-title"
            className="panel max-h-full w-full max-w-md space-y-4 overflow-auto"
            onSubmit={submit}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !busy) setAction(null);
            }}
          >
            <h3 id="course-action-title" className="text-lg font-bold">
              {title}
            </h3>
            <p className="text-sm text-slate-600">
              {action.levelName}
              {action.courseName ? ` / ${action.courseName}` : ""}
              {action.branchName ? ` / ${action.branchName}` : ""}
            </p>
            {deleting ? (
              <p className="text-sm text-red-700">
                {action.kind === "course"
                  ? "Deleting this course also removes its branches."
                  : "This will remove the branch from the course."}
              </p>
            ) : (
              <label className="block text-sm font-semibold">
                {action.kind === "course" ? "Course name" : "Branch name"}
                <input
                  autoFocus
                  className="field mt-1"
                  value={name}
                  required
                  disabled={busy}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button
                autoFocus={deleting}
                type="button"
                className="btn-secondary"
                disabled={busy}
                onClick={() => setAction(null)}
              >
                Cancel
              </button>
              <button
                className={
                  deleting
                    ? "btn !border-red-700 !bg-red-700 !text-white"
                    : "btn-primary"
                }
                disabled={busy}
              >
                {busy
                  ? deleting
                    ? "Deleting…"
                    : "Saving…"
                  : deleting
                    ? "Delete"
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
