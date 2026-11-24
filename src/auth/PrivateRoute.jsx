import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function PrivateRoute() {
  const { session } = useAuth();
  const location = useLocation();
  return session ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
}
