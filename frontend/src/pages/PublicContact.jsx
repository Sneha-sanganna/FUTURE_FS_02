import { useState } from "react";
import api from "../services/api";

const initial = {
  name: "",
  email: "",
  phone: "",
  source: "Website",
  notes: ""
};

export default function PublicContact() {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      await api.post("/leads/public", form);
      setMessage("Thank you! Your request has been submitted.");
      setForm(initial);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit the form");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="public-brand">Client CRM</div>
        <h1>Contact Us</h1>
        <p className="muted">Submit your details and our team will get back to you.</p>

        <form onSubmit={submit} className="form-stack">
          <label>
            Name *
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>

          <label>
            Email *
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>

          <label>
            Phone *
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </label>

          <label>
            Message / Requirement
            <textarea rows="5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>

          {message && <div className="success-box">{message}</div>}
          {error && <div className="error-box">{error}</div>}

          <button className="primary-btn" disabled={busy}>
            {busy ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
