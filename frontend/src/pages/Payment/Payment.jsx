import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useMarketplace } from "../../hooks/useMarketplace";
import OrderSummary from "../../components/commerce/OrderSummary";
import Button from "../../components/ui/Button";
import "../Cart/cart.css";
import "./payment.css";

const paymentOptions = [
  {
    id: "QRIS",
    title: "QRIS",
    description: "Scan with your preferred banking or e-wallet app.",
  },
  {
    id: "Bank Transfer",
    title: "Bank transfer",
    description: "A simple virtual account transfer for this prototype.",
  },
  {
    id: "E-Wallet",
    title: "E-wallet",
    description: "Pay through your usual digital wallet.",
  },
];

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const {
    cartItems,
    cartSubtotal,
    shipping,
    cartTotal,
    checkoutDetails,
    order,
    placeOrder,
  } = useMarketplace();

  const pay = () => {
    const createdOrder = placeOrder(paymentMethod);

    if (createdOrder) {
      setPaymentStatus("paid");
    }
  };

  if (!cartItems.length && !order) {
    return <Navigate to="/cart" replace />;
  }

  if (!checkoutDetails && !order) {
    return <Navigate to="/checkout" replace />;
  }

  if (paymentStatus === "paid" && order) {
    return (
      <div className="payment page">
        <section className="payment-success">
          <span aria-hidden="true">✦</span>
          <p className="eyebrow">Payment received</p>
          <h1>
            You’re all
            <br />
            <i>set.</i>
          </h1>
          <p>
            Your prototype payment with {order.paymentMethod} is marked as paid.
          </p>
          <Button to="/order">View order →</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="payment page">
      <header className="commerce-header">
        <p className="eyebrow">Step 02 / Payment</p>
        <h1>
          Pay your
          <br className="mobile-line-break" /> way<span>.</span>
        </h1>
        <p>Choose a mock payment method for this prototype.</p>
      </header>

      <div className="payment-layout">
        <section className="payment-options" aria-label="Payment options">
          <h2>Payment method.</h2>
          {paymentOptions.map((option) => (
            <label
              key={option.id}
              className={paymentMethod === option.id ? "selected" : ""}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.id}
                checked={paymentMethod === option.id}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span>
                <b>{option.title}</b>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
          <Button onClick={pay}>Pay now →</Button>
          <p className="payment-note">No money moves in this prototype.</p>
        </section>

        <OrderSummary
          items={cartItems}
          subtotal={cartSubtotal}
          shipping={shipping}
          total={cartTotal}
        />
      </div>
    </div>
  );
}
