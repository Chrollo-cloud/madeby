import { formatPrice } from "../../utils/formatPrice";
import "./order-summary.css";

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  title = "Order summary",
}) {
  return (
    <aside className="order-summary">
      <p className="eyebrow">Your order</p>
      <h2>{title}.</h2>

      <div className="order-summary-items">
        {items.map((item) => (
          <article key={item.id} className="order-summary-item">
            <img src={item.image} alt="" />
            <div>
              <h3>{item.title}</h3>
              <p>
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <strong>{formatPrice(item.price * item.quantity)}</strong>
          </article>
        ))}
      </div>

      <dl className="order-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping ? formatPrice(shipping) : "Free"}</dd>
        </div>
        <div className="order-total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
