import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function RequireAdmin({ children }) {
  const { user, loading, error, retry } = useAuth();
  if (loading) return <p role="status">Checking admin session…</p>;
  if (error)
    return (
      <div role="alert">
        Unable to check your session.{" "}
        <button onClick={() => retry()}>Retry</button>
      </div>
    );
  return user?.is_admin ? children : <Navigate to="/admin/login" replace />;
}
