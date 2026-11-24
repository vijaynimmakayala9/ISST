import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const adminName = session?.admin?.name || "Administrator";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileOpen]);

  const signOut = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen min-w-0 bg-gradient-to-br from-[#EEF2FF] via-white to-[#EEF2FF]">
      <Sidebar
        adminName={adminName}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onExpand={() => setCollapsed(false)}
        onLogout={signOut}
      />
      <main
        className={`min-h-screen min-w-0 transition-[margin] duration-200 ${collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"}`}
      >
        <Header
          adminName={adminName}
          collapsed={collapsed}
          onOpenNavigation={() => setMobileOpen(true)}
          onToggleSidebar={() => setCollapsed((current) => !current)}
        />
        <div className="mx-auto max-w-7xl min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
