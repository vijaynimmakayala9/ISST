const KEY = "isst_admin_session";
export const sessionKey = KEY;
const decode = (token) => {
  try {
    const part = token.split(".")[1];
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};
export function clearSession() {
  sessionStorage.removeItem(KEY);
  /* purge legacy persistent sessions */ localStorage.removeItem(KEY);
  localStorage.removeItem("isst_admin_temporary");
  sessionStorage.removeItem("isst_admin_temporary");
}
export function readSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (!value) return null;
    if (!value.token || !value.expiresAt || Date.now() >= value.expiresAt) {
      clearSession();
      return null;
    }
    return value;
  } catch {
    clearSession();
    return null;
  }
}
export function saveSession(token, admin) {
  const claims = decode(token);
  if (!claims?.exp || claims.exp * 1000 <= Date.now())
    throw Error("Invalid or expired session token");
  const value = { token, admin, expiresAt: claims.exp * 1000 };
  clearSession();
  sessionStorage.setItem(KEY, JSON.stringify(value));
  return value;
}
