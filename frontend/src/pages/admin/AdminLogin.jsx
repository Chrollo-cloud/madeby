import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { apiError } from "../../utils/apiClient";
import "./admin.css";
export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  if (user?.is_admin) return <Navigate to="/admin/dashboard" replace />;
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const data = new FormData(event.currentTarget);
    try {
      await login(Object.fromEntries(data));
      toast.success("Welcome back.");
      navigate("/admin/dashboard");
    } catch (error) {
      setErrors(error.response?.data?.errors ?? {});
      toast.error(apiError(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <p className="eyebrow">MADEBY / ADMIN</p>
        <h1>
          Sign in<span>.</span>
        </h1>
      </header>
      <form className="admin-form" onSubmit={submit}>
        <label>
          Email
          <input required name="email" type="email" autoComplete="username" />
        </label>
        <label>
          Password
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </label>
        {Object.entries(errors).map(([key, values]) => (
          <p role="alert" key={key}>
            {values.join(" ")}
          </p>
        ))}
        <button className="button primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
        <a href="/">← Marketplace</a>
      </form>
    </section>
  );
}
