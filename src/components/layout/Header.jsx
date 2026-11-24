import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Maximize,
  Menu,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";

export default function Header({
  adminName,
  collapsed,
  onOpenNavigation,
  onToggleSidebar,
}) {
  const [fullscreen, setFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );
  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) {
      /* Browser may block fullscreen. */
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-indigo-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-[#312E81]">
          <span className="rounded-lg bg-[#4338CA] p-2 text-white">
            <GraduationCap size={19} />
          </span>
          ISST Admin
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Toggle fullscreen"
            onClick={toggleFullscreen}
            className="rounded-lg border border-indigo-100 p-2 text-[#4338CA]"
          >
            {fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onOpenNavigation}
            className="rounded-lg border border-indigo-100 p-2 text-[#4338CA]"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      <header className="hidden h-[76px] items-center justify-between border-b border-indigo-100 bg-white/90 px-6 lg:flex">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleSidebar}
            className="rounded-xl border border-indigo-100 p-2.5 text-[#4338CA] hover:bg-[#EEF2FF]"
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>
          <span className="text-sm font-medium text-[#312E81]">
            ISST / Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="rounded-xl border border-indigo-100 p-2.5 text-[#4338CA] hover:bg-[#EEF2FF]"
          >
            {fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
          </button>
          <ShieldCheck size={18} className="text-[#6366F1]" />
          <span className="max-w-[170px] truncate text-sm font-semibold text-[#312E81]">
            {adminName}
          </span>
        </div>
      </header>
    </>
  );
}
