import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    api.get(`/leads/${id}`)
      .then((res) => setLead(res.data.lead))
      .catch((err) => setError(err.response?.data?.message || "Unable to load lead"));
  };

  useEffect(load, [id]);

  const deleteLead = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    setDeleting(true);
    try {
      await api.delete(`/leads/${id}`);
      navigate("/leads");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete lead");
      setDeleting(false);
    }
  };

  if (error && !lead) return <div className="error-box">{error}</div>;
  if (!lead) return <div className="screen-loader">Loading lead...</div>;

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">LEAD DETAILS</p>
          <h1>{lead.name}</h1>
          <p className="muted">Lead created {new Date(lead.createdAt).toLocaleString()}</p>
        </div>
        <div className="header-actions">
          <Link className="secondary-btn" to="/leads">Back</Link>
          <Link className="primary-btn" to={`/leads/${id}/edit`}>Edit Lead</Link>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      <div className="details-grid">
        <section className="content-card">
          <h2>Contact Information</h2>
          <div className="details-list">
            <Detail label="Name" value={lead.name} />
            <Detail label="Email" value={lead.email} />
            <Detail label="Phone" value={lead.phone} />
            <Detail label="Source" value={lead.source} />
          </div>
        </section>

        <section className="content-card">
          <h2>Lead Status</h2>
          <div className="big-status"><StatusBadge status={lead.status} /></div>
          <div className="details-list">
            <Detail label="Follow-up" value={lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "Not scheduled"} />
            <Detail label="Last updated" value={new Date(lead.updatedAt).toLocaleString()} />
          </div>
        </section>
      </div>

      <section className="content-card">
        <h2>Notes & Follow-up</h2>
        <div className="notes-box">{lead.notes || "No notes added yet."}</div>

        <div className="danger-zone">
          <div>
            <strong>Delete this lead</strong>
            <p className="muted">This action cannot be undone.</p>
          </div>
          <button className="danger-btn" onClick={deleteLead} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Lead"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
