import { Navigate } from "react-router-dom";
import { useMarketplace } from "../../hooks/useMarketplace";
import { formatPrice } from "../../utils/formatPrice";
import OrderSummary from "../../components/commerce/OrderSummary";
import Button from "../../components/ui/Button";
import "./order.css";

export default function Order() {
  const { order } = useMarketplace();

  if (!order) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="order page">
      <header className="order-header">
        <p className="eyebrow">Order placed ✦</p>
        <h1>
          Made for
          <br />
          <i>you.</i>
        </h1>
        <p>Thanks for supporting student-made work.</p>
      </header>

      <div className="order-layout">
        <section className="order-details">
          <div className="order-number">
            <span>Order number</span>
            <strong>{order.id}</strong>
          </div>
          <dl className="order-status">
            <div>
              <dt>Status</dt>
              <dd className="paid-status">{order.status}</dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>{order.paymentMethod}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <p className="order-address">
            We’ll send order updates to <b>{order.customer?.email}</b>.
          </p>
          <div className="order-actions">
            <Button to="/order/success">View order →</Button>
            <Button to="/" variant="light">
              Back to MADEBY →
            </Button>
          </div>
        </section>

        <OrderSummary
          items={order.items}
          subtotal={order.subtotal}
          shipping={order.shipping}
          total={order.total}
          title="Purchased work"
        />
      </div>
    </div>
  );
}
