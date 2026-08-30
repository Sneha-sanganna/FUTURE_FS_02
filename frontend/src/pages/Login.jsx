import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left branding */}
      <div className="login-sidebar">

        <div className="login-brand">
          <div className="login-brand-logo">C</div>

          <div>
            <h2>Client CRM</h2>
            <p>Lead Management</p>
          </div>
        </div>

        <div className="login-sidebar-content">
          <h1>Welcome to<br />Client CRM</h1>

          <p>
            Manage your client leads easily and keep
            your customer information organized.
          </p>
        </div>

      </div>


      {/* Login area */}
      <div className="login-content">

        <div className="login-box">

          <div className="login-header">
            <span>ADMIN PORTAL</span>

            <h1>Sign in</h1>

            <p>
              Sign in to manage your client leads.
            </p>
          </div>


          <form onSubmit={submit}>

            <label>Email</label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />


            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={busy}
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>

          </form>


          <div className="demo-login">
            <strong>Demo login</strong>
            <span>admin@example.com</span>
            <span>Admin@123</span>
          </div>

        </div>

      </div>

    </div>
  );
}