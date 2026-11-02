import { Link } from "react-router-dom";
import { useMarketplace } from "../../hooks/useMarketplace";
import { formatPrice } from "../../utils/formatPrice";
import OrderSummary from "../../components/commerce/OrderSummary";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import "./cart.css";

export default function Cart() {
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    shipping,
    cartTotal,
  } = useMarketplace();

  if (!cartItems.length) {
    return (
      <div className="cart page">
        <header className="commerce-header">
          <p className="eyebrow">Ready-made work</p>
          <h1>
            Your cart<span>.</span>
          </h1>
        </header>
        <EmptyState
          title="Your cart is empty."
          text="Find something made by a student."
        />
      </div>
    );
  }

  return (
    <div className="cart page">
      <header className="commerce-header">
        <p className="eyebrow">Ready-made work</p>
        <h1>
          Your cart<span>.</span>
        </h1>
        <p>Good things are almost yours.</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Cart items">
          {cartItems.map((item) => (
            <article key={item.id} className="cart-item">
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.title} />
              </Link>
              <div className="cart-item-copy">
                <p className="eyebrow">Ready-made · {item.category}</p>
                <Link to={`/product/${item.id}`}>
                  <h2>{item.title}</h2>
                </Link>
                <p>by {item.creatorId}</p>
                <strong>{formatPrice(item.price)}</strong>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control" aria-label={`${item.title} quantity`}>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease ${item.title} quantity`}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.id,
                        Math.min(item.quantity + 1, item.stock),
                      )
                    }
                    aria-label={`Increase ${item.title} quantity`}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <button
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="cart-summary">
          <OrderSummary
            items={cartItems}
            subtotal={cartSubtotal}
            shipping={shipping}
            total={cartTotal}
          />
          <Button to="/checkout">Continue to checkout →</Button>
        </div>
      </div>
    </div>
  );
}
