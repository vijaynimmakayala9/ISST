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
  guidance.some((item) => pathname.startsWith(`/admin/${item.path}`));

export default function Sidebar({
  adminName,
  collapsed,
  mobileOpen,
  onClose,
  onExpand,
  onLogout,
}) {
  const { pathname } = useLocation();
  const [guidanceOpen, setGuidanceOpen] = useState(() =>
    isGuidanceRoute(pathname),
  );
  const activeResource = resources.find(
    ({ path }) =>
      pathname === `/admin/${path}` || pathname.startsWith(`/admin/${path}/`),
  )?.path;
  const [openResource, setOpenResource] = useState(activeResource);
  const guidanceActive = isGuidanceRoute(pathname);
  useEffect(() => {
    if (activeResource) setOpenResource(activeResource);
  }, [activeResource, pathname]);
  useEffect(() => {
    if (isGuidanceRoute(pathname)) setGuidanceOpen(true);
  }, [pathname]);
  const item = ({ path, label, Icon }, nested = false, hidden = false) => (
    <NavLink
      key={path}
      to={`/admin/${path}`}
      tabIndex={hidden ? -1 : undefined}
      end={path !== "scholarships"}
      title={collapsed ? label : undefined}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex min-h-[43px] items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 ${isActive ? "bg-white text-[#312E81] shadow-sm" : "text-indigo-100 hover:bg-white/10 hover:text-white"} ${nested ? "min-h-[40px] ml-2" : ""} ${collapsed ? "lg:justify-center" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.3 : 1.9}
            className={`shrink-0 ${isActive ? "text-[#4338CA]" : "text-indigo-100"}`}
          />
          <span
            className={`min-w-0 flex-1 truncate ${collapsed ? "lg:hidden" : ""}`}
          >
            {label}
          </span>
          {isActive && (
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1] ${collapsed ? "lg:hidden" : ""}`}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/45 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col overflow-hidden border-r border-indigo-400/20 bg-gradient-to-b from-[#312E81] to-indigo-950 text-white shadow-lg shadow-indigo-950/10 transition-[width,transform] duration-200 ${collapsed ? "lg:w-[76px]" : "lg:w-[260px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6366F1]">
              <GraduationCap size={23} />
            </div>
            <div className={collapsed ? "lg:hidden" : ""}>
              <div className="text-lg font-bold tracking-tight">ISST Admin</div>
              <div className="text-[11px] text-[#A5B4FC]">
                Management Portal
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className={`sidebar-campus mx-3 mt-3 h-[78px] shrink-0 rounded-xl border border-white/15 ${collapsed ? "lg:hidden" : ""}`}
          aria-hidden="true"
        />
        <nav
          aria-label="Admin navigation"
          className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-5 [scrollbar-width:thin] [scrollbar-color:#60A5FA_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {item({
            path: "dashboard",
            label: "Dashboard",
            Icon: LayoutDashboard,
          })}
          {item({ path: "banners", label: "Banners", Icon: Image })}
          {item({ path: "education-levels", label: "Education Levels", Icon: GraduationCap })}
          <div className="my-3 border-t border-white/10" />
          <button
            type="button"
            aria-expanded={guidanceOpen}
            aria-controls="guidance-menu"
            onClick={() => {
              if (collapsed) onExpand();
              setGuidanceOpen((open) => collapsed || !open);
            }}
            className={`flex min-h-[43px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-white/10 ${guidanceActive ? "bg-white/10 text-white" : "text-indigo-100"}`}
          >
            <BookOpen size={18} className="shrink-0" />
            <span className={`flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              Guidance
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${guidanceOpen ? "rotate-180" : ""} ${collapsed ? "lg:hidden" : ""}`}
            />
          </button>
          {guidanceOpen && (
            <div
              id="guidance-menu"
              className={`mt-1 space-y-0.5 border-l border-[#6366F1]/70 pl-1 ${collapsed ? "lg:hidden" : ""}`}
            >
              {guidance.map((entry) => item(entry, true))}
            </div>
          )}
          <div className="my-3 border-t border-white/10" />
          {item({ path: "scholarships", label: "Scholarships", Icon: Award })}
          {resources.map(({ path, label, category, Icon }) => {
            const expanded = openResource === path;
            return (
              <div key={path}>
                <button
                  type="button"
                  title={label}
                  aria-expanded={expanded}
                  aria-controls={`${path}-menu`}
                  onClick={() => {
                    if (collapsed) onExpand();
                    setOpenResource(collapsed || !expanded ? path : undefined);
                  }}
                  className={`flex min-h-[43px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors hover:bg-white/10 ${activeResource === path ? "bg-white/10 text-white" : "text-indigo-100"} ${collapsed ? "lg:justify-center" : ""}`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className={`flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                    {label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expanded ? "rotate-180" : ""} ${collapsed ? "lg:hidden" : ""}`}
                  />
                </button>
                <div
                  id={`${path}-menu`}
                  aria-hidden={!expanded}
                  className={`grid transition-[grid-template-rows] duration-200 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${collapsed ? "lg:hidden" : ""}`}
                >
                  <div className="overflow-hidden">
                    <div className="mb-1 ml-2 border-l border-indigo-400/70 pl-1">
                      {item(
                        {
                          path: `${path}/categories`,
                          label: category,
                          Icon: Tags,
                        },
                        true,
                        !expanded,
                      )}
                      {item(
                        { path, label: `All ${label}`, Icon },
                        true,
                        !expanded,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-white/10 p-3">
          <div
            className={`mb-2 flex items-center gap-2 rounded-xl bg-white/5 p-2 ${collapsed ? "lg:justify-center" : ""}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-sm font-semibold">
              {adminName.trim().charAt(0).toUpperCase() || "A"}
            </div>
            <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
              <div className="truncate text-xs font-semibold">{adminName}</div>
              <div className="text-[11px] text-[#A5B4FC]">Administrator</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-indigo-100 transition-colors hover:bg-white/10 hover:text-white ${collapsed ? "lg:justify-center" : ""}`}
          >
            <LogOut size={18} />
            <span className={collapsed ? "lg:hidden" : ""}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
