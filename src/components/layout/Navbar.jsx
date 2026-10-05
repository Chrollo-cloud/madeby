import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useMarketplace } from "../../hooks/useMarketplace";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { savedProducts, cartItems } = useMarketplace();
  const close = () => setOpen(false);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={close}>
          <img src="/images/brand/madeby-mark.png" alt="MADEBY" />
        </Link>
        <button
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i></i>
          <i></i>
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/explore" onClick={close}>
            Explore
          </NavLink>
          <NavLink to="/creator/maylin" onClick={close}>
            Creators
          </NavLink>
          <NavLink to="/saved" onClick={close}>
            Saved <b>{String(savedProducts.length).padStart(2, "0")}</b>
          </NavLink>
          <NavLink to="/cart" onClick={close}>
            Cart <b>{String(cartCount).padStart(2, "0")}</b>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
