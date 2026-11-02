export default function ProductBadge({ product }) {
  if (product.type === "commission")
    return (
      <span className="stock commission-stock">
        {product.commissionSlots} slots open
      </span>
    );
  const { stock } = product;
  return (
    <span className={`stock ${stock === 0 ? "sold" : stock <= 3 ? "low" : ""}`}>
      {stock > 3 ? "In stock" : stock > 0 ? `Only ${stock} left` : "Sold out"}
    </span>
  );
}
