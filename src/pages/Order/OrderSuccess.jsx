import { Navigate } from "react-router-dom";
import { useMarketplace } from "../../hooks/useMarketplace";
import Button from "../../components/ui/Button";
import "./order.css";

export default function OrderSuccess() {
  const { order } = useMarketplace();

  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="order-success page">
      <section>
        <span aria-hidden="true">✦</span>
        <p className="eyebrow">Order complete</p>
        <h1>
          Thank
          <br />
          <i>you.</i>
        </h1>
        <p>Your order is on its way.</p>
        <p className="order-success-note">
          We’ll keep the updates for {order.id} simple and clear.
        </p>
        <Button to="/">Back to MADEBY →</Button>
      </section>
    </div>
  );
}
