import React, { useEffect, useState } from "react";
import {
  X,
  Eye,
  ExternalLink,
  PlayCircle,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { config, get } from "./courseSelectionApi";
import { errorText } from "../../api/axiosInstance";

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
const isVideoUrl = (value, key = "") =>
  typeof value === "string" &&
  /^https?:\/\//i.test(value) &&
  (/video/i.test(key) || /\.(mp4|webm|mov)(?:[?#]|$)/i.test(value));
function RichValue({ value, field = "" }) {
  if (value === null || value === undefined || value === "")
    return <span className="text-slate-400">—</span>;
  if (typeof value === "boolean")
    return (
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${value ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}
      >
        {value ? "Active / Yes" : "Inactive / No"}
      </span>
    );
  if (Array.isArray(value))
    return value.length ? (
      <div className="grid gap-2">
        {value.map((v, i) => (
          <div
            key={i}
            className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3"
          >
            <RichValue value={v} field={field} />
          </div>
        ))}
      </div>
    ) : (
      <span className="text-slate-400">None</span>
    );
  if (typeof value === "object")
    return (
      <div className="grid gap-2">
        {Object.entries(value)
          .filter(([k]) => k !== "__v")
          .map(([k, v]) => (
            <div
              key={k}
              className="grid gap-1 sm:grid-cols-[135px_minmax(0,1fr)]"
            >
              <span className="text-xs font-semibold capitalize text-slate-500">
                {k.replace(/([A-Z])/g, " $1")}
              </span>
              <div className="min-w-0">
                <RichValue value={v} field={k} />
              </div>
            </div>
          ))}
      </div>
    );
  const str = String(value);
  if (isImageUrl(str, field))
    return <ImagePreview src={str} alt={field || "Image"} />;
  if (
    /^https?:\/\//i.test(str) &&
    /\.(mp4|webm|mov|mkv|avi|flv|wmv)(?:[?#]|$)/i.test(str)
  )
    return (
      <video
        className="w-full rounded-xl"
        src={str}
        controls
        preload="metadata"
      />
    );
  if (isVideoUrl(str, field))
    return (
      <a
        href={str}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-semibold text-indigo-700 hover:bg-indigo-100"
      >
        <PlayCircle size={17} />
        View video <ExternalLink size={14} />
      </a>
    );
  if (/^https?:\/\//i.test(str))
    return (
      <a
        href={str}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex max-w-full items-center gap-1 break-all text-indigo-600 underline underline-offset-2"
      >
        {str}
        <ExternalLink size={13} className="shrink-0" />
      </a>
    );
  return <span className="whitespace-pre-wrap break-words">{str}</span>;
}

export default function SingleCourseSelection({ item, onClose, onEdit }) {
  const [record, setRecord] = useState(item),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setRecord(item);
    setLoading(true);
    setError("");
    get(item._id)
      .then((result) => {
        if (!result) throw Error("Record details are unavailable.");
        if (active) setRecord(result);
      })
      .catch((err) => {
        if (active) setError(errorText(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [item]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const hero = getRecordImage(record);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${config.title} details`}
        className="flex max-h-[95dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-100 p-3 text-indigo-700">
              <Eye size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-slate-800 sm:text-xl">
                {record.title || record.name || "Record details"}
              </h2>
              <p className="text-xs text-slate-500">
                {config.title} · Complete record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-xl border border-indigo-100 p-2 hover:bg-indigo-100"
          >
            <X size={20} />
          </button>
        </header>
        <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <p className="mb-4 flex items-center gap-2 text-sm text-indigo-600">
              <RefreshCw size={16} className="animate-spin" />
              Loading full details...
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
            >
              {error}. Showing available list data.
            </p>
          )}
          {hero && (
            <div className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-3 sm:p-5">
              <ImagePreview
                src={hero}
                alt={record.title || record.name || "Record image"}
              />
            </div>
          )}
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(record)
              .filter(
                ([k]) =>
                  !["__v"].includes(k) &&
                  !(hero && getRecordImage({ [k]: record[k] }) === hero),
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  className={`min-w-0 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm ${typeof value === "object" || key === "description" ? "sm:col-span-2" : ""}`}
                >
                  <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                  </dt>
                  <dd className="text-sm leading-6 text-slate-700">
                    <RichValue value={value} field={key} />
                  </dd>
                </div>
              ))}
          </dl>
        </div>
        <footer className="shrink-0 border-t border-indigo-100 bg-indigo-50/50 px-5 py-3 text-right">
          <button
            type="button"
            className="btn-primary mr-2"
            disabled={loading || Boolean(error)}
            onClick={() => onEdit(record)}
          >
            Edit
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
