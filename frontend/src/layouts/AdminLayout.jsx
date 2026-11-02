import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import "./admin-layout.css";

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="admin-main">
        <header className="admin-mobile-header">
          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin navigation"
          >
            Menu
          </button>
          <span>MADEBY ADMIN</span>
        </header>
        <div className="admin-session">
          <button
            onClick={() =>
              logout().catch(() =>
                toast.error("Unable to sign out. Please retry."),
              )
            }
          >
            Sign out
          </button>
        </div>
        <Outlet />
        <footer className="admin-footer">
          MADEBY ADMIN · Student marketplace prototype
        </footer>
      </main>
    </div>
  );
}
