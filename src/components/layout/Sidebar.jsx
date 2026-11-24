import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Map,
  School,
  Image,
  LogOut,
  X,
  Layers3,
  ChevronDown,
  ChevronRight,
  Award,
  ClipboardList,
  Landmark,
  FileCheck2,
  BriefcaseBusiness,
  Tags,
} from "lucide-react";

const guidance = [
  { path: "skill-development", label: "Skill Development", Icon: BookOpen },
  { path: "course-selection", label: "Course Selection", Icon: Layers3 },
  { path: "career-route-map", label: "Career Route Map", Icon: Map },
  { path: "college-selection", label: "College Selection", Icon: School },
];

const resources = [
  {
    path: "entrance-exams",
    label: "Entrance Exams",
    category: "Exam Categories",
    Icon: ClipboardList,
  },
  {
    path: "education-loans",
    label: "Education Loans",
    category: "Loan Categories",
    Icon: Landmark,
  },
  {
    path: "admissions",
    label: "Admissions",
    category: "Admission Categories",
    Icon: FileCheck2,
  },
  {
    path: "placement-trainings",
    label: "Placement Trainings",
    category: "Placement Categories",
    Icon: BriefcaseBusiness,
  },
];

const isGuidanceRoute = (pathname) =>
  guidance.some(
    ({ path }) =>
      pathname === `/admin/${path}` || pathname.startsWith(`/admin/${path}/`),
  );

export default function Sidebar({
  adminName,
  collapsed,
  mobileOpen,
  onClose,
  onExpand,
  onLogout,
}) {
  const { pathname } = useLocation();
  const guidanceActive = isGuidanceRoute(pathname);
  const activeResource = resources.find(
    ({ path }) =>
      pathname === `/admin/${path}` || pathname.startsWith(`/admin/${path}/`),
  )?.path;

  const [guidanceOpen, setGuidanceOpen] = useState(guidanceActive);
  const [openResource, setOpenResource] = useState(activeResource);
  const name = adminName?.trim() || "Admin";
  const hideCollapsed = collapsed ? "lg:hidden" : "";

  useEffect(() => {
    if (activeResource) setOpenResource(activeResource);
  }, [activeResource, pathname]);

  useEffect(() => {
    if (isGuidanceRoute(pathname)) setGuidanceOpen(true);
  }, [pathname]);

  const menuClass = (active, nested = false) =>
    `group relative flex w-full items-center gap-2.5 overflow-hidden rounded-2xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
      nested
        ? "min-h-[40px] px-2 py-1 text-[12px]"
        : "min-h-[52px] px-2.5 py-1.5 text-[13px]"
    } ${
      active
        ? "border-white bg-white/90 font-semibold text-[#4338CA] shadow-[0_5px_15px_rgba(67,56,202,0.12)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-[#6366F1]"
        : "border-transparent font-medium text-slate-800 hover:border-white/80 hover:bg-white/60 hover:text-[#4338CA]"
    } ${collapsed ? "lg:justify-center lg:px-1 lg:gap-0" : ""}`;

  const menuIcon = (Icon, active, nested = false) => (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl transition-colors ${nested ? "h-7 w-7" : "h-9 w-9"} ${active ? "bg-[#E0E7FF] text-[#4338CA]" : "text-slate-700 group-hover:bg-indigo-100/70 group-hover:text-[#4338CA]"}`}
    >
      <Icon
        size={nested ? 15 : 20}
        strokeWidth={active ? 2.3 : 1.85}
        aria-hidden="true"
      />
    </span>
  );

  const section = (label) => (
    <div
      className={`flex items-center gap-2 px-2.5 pb-1 pt-4 ${hideCollapsed}`}
    >
      <span className="h-px w-3 bg-[#6366F1]" />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
    </div>
  );

  const item = ({ path, label, Icon }, nested = false) => (
    <NavLink
      key={path}
      to={`/admin/${path}`}
      end={path !== "scholarships"}
      title={label}
      onClick={onClose}
      className={({ isActive }) => menuClass(isActive, nested)}
    >
      {({ isActive }) => (
        <>
          {menuIcon(Icon, isActive, nested)}
          <span className={`min-w-0 flex-1 leading-snug ${hideCollapsed}`}>
            {label}
          </span>
          {isActive && (
            <ChevronRight
              size={15}
              className={`shrink-0 text-[#6366F1] ${hideCollapsed}`}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  );

  const dropdown = ({ label, Icon, active, expanded, id, onClick }) => (
    <button
      type="button"
      title={label}
      aria-expanded={Boolean(expanded)}
      aria-controls={id}
      onClick={onClick}
      className={menuClass(active)}
    >
      {menuIcon(Icon, active)}
      <span className={`min-w-0 flex-1 leading-snug ${hideCollapsed}`}>
        {label}
      </span>
      <ChevronDown
        size={15}
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""} ${hideCollapsed}`}
      />
    </button>
  );

  const submenuClass = `ml-5 mt-1 space-y-1 border-l border-[#A5B4FC] pl-2 ${hideCollapsed}`;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 isolate flex w-[260px] max-w-[90vw] flex-col overflow-hidden border-r border-indigo-100 bg-[#EEF2FF] text-slate-800 shadow-[5px_0_28px_rgba(49,46,129,0.08)] transition-[width,transform] duration-200 ${collapsed ? "lg:w-[76px]" : "lg:w-[260px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Fixed artwork behind the entire sidebar, not behind each menu item. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/sidebar-bg.svg')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/5 via-white/45 to-white/15"
        />

        {/* Branding */}
        <div
          className={`flex h-[76px] shrink-0 items-center justify-between px-4 ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/90 p-1 shadow-sm">
              <img
                src="/logo.png"
                alt="ISST Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className={`min-w-0 ${hideCollapsed}`}>
              <div className="truncate text-[19px] font-extrabold tracking-tight text-[#312E81]">
                ISST Admin
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Management Portal
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Independently scrolling navigation; artwork remains stationary. */}
        <nav
          aria-label="Admin navigation"
          className={`min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 pb-5 pt-1 [scrollbar-width:thin] [scrollbar-color:#60A5FA_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-track]:bg-transparent ${collapsed ? "lg:px-2" : ""}`}
        >
          {section("Overview")}
          {item({
            path: "dashboard",
            label: "Dashboard",
            Icon: LayoutDashboard,
          })}

          {section("Management")}
          {item({ path: "banners", label: "Banners", Icon: Image })}
          {item({
            path: "education-levels",
            label: "Education Levels",
            Icon: GraduationCap,
          })}
          {dropdown({
            label: "Guidance",
            Icon: BookOpen,
            active: guidanceActive,
            expanded: guidanceOpen,
            id: "guidance-menu",
            onClick: () => {
              if (collapsed) onExpand?.();
              setGuidanceOpen((open) => collapsed || !open);
            },
          })}
          <div
            id="guidance-menu"
            hidden={!guidanceOpen}
            className={submenuClass}
          >
            {guidance.map((entry) => item(entry, true))}
          </div>

          {section("Resources")}
          {item({ path: "scholarships", label: "Scholarships", Icon: Award })}
          {resources.map(({ path, label, category, Icon }) => {
            const expanded = openResource === path;
            return (
              <div key={path}>
                {dropdown({
                  label,
                  Icon,
                  active: activeResource === path,
                  expanded,
                  id: `${path}-menu`,
                  onClick: () => {
                    if (collapsed) onExpand?.();
                    setOpenResource(collapsed || !expanded ? path : undefined);
                  },
                })}
                <div
                  id={`${path}-menu`}
                  hidden={!expanded}
                  className={submenuClass}
                >
                  {item(
                    { path: `${path}/categories`, label: category, Icon: Tags },
                    true,
                  )}
                  {item({ path, label: `All ${label}`, Icon }, true)}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Fixed footer */}
        <div
          className={`shrink-0 border-t border-white/70 bg-white/30 p-3 backdrop-blur-sm ${collapsed ? "lg:px-2" : ""}`}
        >
          <div
            className={`mb-2 flex items-center gap-2 rounded-xl px-2 py-1.5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#4338CA] text-sm font-semibold text-white shadow-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className={`min-w-0 ${hideCollapsed}`}>
              <div className="truncate text-xs font-bold text-[#312E81]">
                {name}
              </div>
              <div className="text-[11px] text-slate-500">Administrator</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out"
            className={`group flex min-h-[48px] w-full items-center gap-2.5 rounded-2xl border border-rose-200 bg-white/85 px-3 text-sm font-semibold text-rose-600 shadow-[0_4px_14px_rgba(225,29,72,0.08)] transition-colors hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 ${collapsed ? "lg:justify-center lg:px-1" : ""}`}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`flex-1 text-left ${hideCollapsed}`}>Logout</span>
            <ChevronRight
              size={16}
              className={`shrink-0 ${hideCollapsed}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </aside>
    </>
  );
}
