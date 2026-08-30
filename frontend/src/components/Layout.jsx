import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <strong>Client CRM</strong>
            <span>Lead Management</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/leads">Leads</NavLink>
          <NavLink to="/leads/new">Add Lead</NavLink>
          <NavLink to="/contact">Public Contact Form</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-box">
            <div className="avatar">{user?.name?.charAt(0) || "A"}</div>
            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
