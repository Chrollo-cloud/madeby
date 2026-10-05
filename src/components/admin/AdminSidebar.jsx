import { Link, NavLink } from "react-router-dom";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {sidebarOpen && (
        <button
          className="admin-scrim"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-top">
          <Link
            to="/admin/dashboard"
            className="admin-brand"
            onClick={closeSidebar}
          >
            MADEBY
            <span>ADMIN</span>
          </Link>
          <button
            className="admin-close-button"
            onClick={closeSidebar}
            aria-label="Close admin navigation"
          >
            ×
          </button>
        </div>
        <nav aria-label="Admin navigation">
          <NavLink to="/admin/dashboard" onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/about" onClick={closeSidebar}>
            About
          </NavLink>
        </nav>
        <Link to="/" className="admin-marketplace-link" onClick={closeSidebar}>
          ← Back to marketplace
        </Link>
      </aside>
    </>
  );
}
