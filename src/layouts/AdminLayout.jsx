import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import "./admin-layout.css";

export default function AdminLayout() {
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
        <Outlet />
        <footer className="admin-footer">
          MADEBY ADMIN · Student marketplace prototype
        </footer>
      </main>
    </div>
  );
}
