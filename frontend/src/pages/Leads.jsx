import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search;
      if (status) params.status = status;
      const res = await api.get("/leads", { params });
      setLeads(res.data.leads);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadLeads, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">CRM</p>
          <h1>Leads</h1>
          <p className="muted">View, search and manage all client leads.</p>
        </div>
        <Link className="primary-btn" to="/leads/new">+ Add Lead</Link>
      </header>

      <section className="content-card">
        <div className="filters">
          <input
            className="search-input"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
            <option>Lost</option>
          </select>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Follow-up</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="empty-state">Loading leads...</td></tr>
              ) : leads.length ? (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <strong>{lead.name}</strong>
                      <span className="table-sub">{lead.email}</span>
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.source}</td>
                    <td><StatusBadge status={lead.status} /></td>
                    <td>{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "—"}</td>
                    <td><Link className="small-btn" to={`/leads/${lead._id}`}>View</Link></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="empty-state">No matching leads.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
