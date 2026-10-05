import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "../../data/products";
import { creators } from "../../data/creators";
import { formatPrice } from "../../utils/formatPrice";
import { useMarketplace } from "../../hooks/useMarketplace";
import SaveButton from "../../components/product/SaveButton";
import ProductBadge from "../../components/product/ProductBadge";
import ProductGrid from "../../components/product/ProductGrid";
import CommissionRequestModal from "../../components/product/CommissionRequestModal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import "./product-detail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const [added, setAdded] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { addToCart } = useMarketplace();
  if (!product) return <EmptyState title="This work wandered off." />;
  const creator = creators.find((item) => item.id === product.creatorId);
  const related = products
    .filter((item) => item.creatorId === creator.id && item.id !== product.id)
    .slice(0, 3);
  const commission = product.type === "commission";
  const images = product.images?.length ? product.images : [product.image];
  const add = () => {
    if (product.stock) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };
  const actionLabel =
    product.category === "PHOTOGRAPHY"
      ? "Request a shoot"
      : "Request commission";
  return (
    <div className="detail page">
      <Link className="back" to="/explore">
        ← Back to explore
      </Link>
      <section className="detail-top">
        <div>
          <div className="detail-image">
            <img
              key={images[imageIndex]}
              className="gallery-image"
              src={images[imageIndex]}
              alt={
                commission
                  ? `${product.title} example work ${imageIndex + 1}`
                  : product.title
              }
            />
            <SaveButton product={product} />
          </div>
          {images.length > 1 && (
            <div className="detail-gallery" aria-label="Listing image gallery">
              {images.map((image, index) => (
                <button
                  key={image}
                  className={imageIndex === index ? "active" : ""}
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <p className="category">
            {product.category} · {commission ? "Commission" : "Ready-made"}
          </p>
          <h1>
            {product.title}
            <span>.</span>
          </h1>
          <Link className="detail-creator" to={`/creator/${creator.id}`}>
            <img src={creator.avatar} alt="" />
            {commission
              ? `Example work by ${creator.name}`
              : `by ${creator.name}`}{" "}
            <span>↗</span>
          </Link>
          <p className="detail-description">{product.description}</p>
          <div className="detail-meta">
            <strong>
              {commission
                ? `From ${formatPrice(product.priceFrom)}`
                : formatPrice(product.price)}
            </strong>
            <span>★ {product.rating} rating</span>
            <ProductBadge product={product} />
          </div>
          {commission ? (
            <>
              <div className="commission-facts">
                <span>
                  <b>{product.commissionSlots}</b> commission slots
                </span>
                <span>
                  Delivery: <b>{product.deliveryTime}</b>
                </span>
              </div>
              <Button onClick={() => setRequestOpen(true)}>
                {actionLabel} →
              </Button>
              <p className="detail-note">
                The image shown is an example of the creator’s work.
              </p>
            </>
          ) : (
            <>
              <Button
                onClick={add}
                disabled={product.stock === 0}
                className={added ? "added" : ""}
              >
                {product.stock === 0
                  ? "Sold out"
                  : added
                    ? "Added ✓"
                    : "Add to cart +"}
              </Button>
              <p className="detail-note">
                Small-batch work, shipped with care.
              </p>
            </>
          )}
        </div>
      </section>
      <section className="about-creator">
        <p className="eyebrow">About the creator</p>
        <Link to={`/creator/${creator.id}`}>
          <img src={creator.avatar} alt="" />
          <div>
            <h2>{creator.name}</h2>
            <p>
              {creator.role} · {creator.location}
            </p>
          </div>
          <span>View profile →</span>
        </Link>
      </section>
      {related.length > 0 && (
        <section className="more">
          <p className="eyebrow">More from {creator.name}</p>
          <h2>
            Keep <i>looking</i>.
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
      {requestOpen && (
        <CommissionRequestModal
          product={product}
          onClose={() => setRequestOpen(false)}
        />
      )}
    </div>
  );
}
