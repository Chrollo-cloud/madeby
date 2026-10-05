import { Link } from "react-router-dom";
import { useState } from "react";
import SaveButton from "./SaveButton";
import ProductBadge from "./ProductBadge";
import { creators } from "../../data/creators";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductCard({ product }) {
  const creator = creators.find((item) => item.id === product.creatorId);
  const images = product.images?.length ? product.images : [product.image];
  const [imageIndex, setImageIndex] = useState(0);
  const isCommission = product.type === "commission";
  const setFromCursor = (event) => {
    if (images.length < 2) return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    setImageIndex(
      Math.min(
        images.length - 1,
        Math.max(
          0,
          Math.floor(((event.clientX - left) / width) * images.length),
        ),
      ),
    );
  };
  const onTouchEnd = (event) => {
    if (images.length < 2) return;
    event.preventDefault();
    setImageIndex((index) => (index + 1) % images.length);
  };
  return (
    <article
      className={`product-card ${isCommission ? "commission-card" : "ready-card"}`}
    >
      <Link
        to={`/product/${product.id}`}
        className="product-image"
        onMouseMove={setFromCursor}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={images[imageIndex]}
          className="gallery-image"
          src={images[imageIndex]}
          alt={
            isCommission
              ? `${product.title} example work ${imageIndex + 1}`
              : product.title
          }
        />
        {images.length > 1 && (
          <span
            className="gallery-count"
            aria-label={`${imageIndex + 1} of ${images.length} images`}
          >
            {String(imageIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
        )}
        <SaveButton product={product} />
        <ProductBadge product={product} />
      </Link>
      <div className="product-info">
        <p className="category">
          {product.category} · {isCommission ? "Commission" : "Ready-made"}
        </p>
        <div className="product-line">
          <Link to={`/product/${product.id}`}>
            <h3>{product.title}</h3>
          </Link>
          <strong>
            {isCommission
              ? `From ${formatPrice(product.priceFrom)}`
              : formatPrice(product.price)}
          </strong>
        </div>
        <Link className="byline" to={`/creator/${creator.id}`}>
          {isCommission
            ? `example work by ${creator.name}`
            : `by ${creator.name}`}
        </Link>
      </div>
    </article>
  );
}
