import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/leads/stats"),
      api.get("/leads")
    ])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes.data.stats);
        setLeads(leadsRes.data.leads.slice(0, 5));
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard"));
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="muted">Track and manage your client leads.</p>
        </div>
        <Link className="primary-btn" to="/leads/new">+ Add New Lead</Link>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="stats-grid">
        <StatCard title="Total Leads" value={stats?.total ?? "—"} />
        <StatCard title="New Leads" value={stats?.newLeads ?? "—"} />
        <StatCard title="Contacted" value={stats?.contacted ?? "—"} />
        <StatCard title="Converted" value={stats?.converted ?? "—"} />
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Recent Leads</h2>
            <p className="muted">Latest leads added to the CRM.</p>
          </div>
          <Link to="/leads" className="text-link">View all →</Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <strong>{lead.name}</strong>
                    <span className="table-sub">{lead.email}</span>
                  </td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td><Link className="small-btn" to={`/leads/${lead._id}`}>View</Link></td>
                </tr>
              ))}
              {!leads.length && (
                <tr><td colSpan="5" className="empty-state">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}
