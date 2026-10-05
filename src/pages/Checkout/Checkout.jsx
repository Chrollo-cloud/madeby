import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMarketplace } from "../../hooks/useMarketplace";
import OrderSummary from "../../components/commerce/OrderSummary";
import Button from "../../components/ui/Button";
import "../Cart/cart.css";
import "./checkout.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const {
    cartItems,
    cartSubtotal,
    shipping,
    cartTotal,
    setCheckoutDetails,
  } = useMarketplace();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitCheckout = (event) => {
    event.preventDefault();
    setCheckoutDetails(form);
    navigate("/payment");
  };

  if (!cartItems.length) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="checkout page">
      <header className="commerce-header">
        <p className="eyebrow">Step 01 / Details</p>
        <h1>
          Checkout<span>.</span>
        </h1>
        <p>Where should we send your order?</p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitCheckout}>
          <h2>Your details.</h2>
          <label>
            Full name
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
            />
          </label>
          <label>
            Phone
            <input
              required
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateField}
              autoComplete="tel"
            />
          </label>
          <label className="checkout-form-wide">
            Address
            <textarea
              required
              name="address"
              value={form.address}
              onChange={updateField}
              rows="5"
              autoComplete="street-address"
            />
          </label>
          <div className="checkout-form-wide">
            <Button type="submit">Continue to payment →</Button>
          </div>
        </form>

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
