import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  notes: "",
  followUpDate: ""
};

export default function LeadForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    api.get(`/leads/${id}`)
      .then((res) => {
        const lead = res.data.lead;
        setForm({
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          source: lead.source || "Website",
          status: lead.status || "New",
          notes: lead.notes || "",
          followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : ""
        });
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load lead"))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editing) {
        await api.put(`/leads/${id}`, form);
      } else {
        await api.post("/leads", form);
      }
      navigate(editing ? `/leads/${id}` : "/leads");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save lead");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="screen-loader">Loading lead...</div>;

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">CRM</p>
          <h1>{editing ? "Edit Lead" : "Add New Lead"}</h1>
          <p className="muted">{editing ? "Update lead information and follow-up details." : "Create a new client lead."}</p>
        </div>
        <Link className="secondary-btn" to={editing ? `/leads/${id}` : "/leads"}>Cancel</Link>
      </header>

      <section className="content-card form-card">
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Full Name *
              <input name="name" value={form.name} onChange={change} required minLength="2" />
            </label>

            <label>
              Email *
              <input type="email" name="email" value={form.email} onChange={change} required />
            </label>

            <label>
              Phone *
              <input name="phone" value={form.phone} onChange={change} required />
            </label>

            <label>
              Source
              <select name="source" value={form.source} onChange={change}>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Advertisement</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={change}>
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>
            </label>

            <label>
              Follow-up Date
              <input type="date" name="followUpDate" value={form.followUpDate} onChange={change} />
            </label>
          </div>

          <label>
            Notes
            <textarea
              name="notes"
              rows="6"
              placeholder="Add notes about calls, requirements or follow-ups..."
              value={form.notes}
              onChange={change}
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <div className="form-actions">
            <Link className="secondary-btn" to={editing ? `/leads/${id}` : "/leads"}>Cancel</Link>
            <button className="primary-btn" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
