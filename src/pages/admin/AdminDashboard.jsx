import { products } from "../../data/products";
import { creators } from "../../data/creators";
import { formatPrice } from "../../utils/formatPrice";
import "./admin.css";

export default function AdminDashboard() {
  const readyMade = products.filter((product) => product.type === "product");
  const commissions = products.filter(
    (product) => product.type === "commission",
  );

  const statistics = [
    { label: "Listings", value: products.length, accent: "yellow" },
    { label: "Ready-made", value: readyMade.length, accent: "pink" },
    { label: "Commissions", value: commissions.length, accent: "blue" },
    { label: "Creators", value: creators.length, accent: "lime" },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <p className="eyebrow">MADEBY / ADMIN</p>
        <h1>
          Dashboard<span>.</span>
        </h1>
        <p>Here’s the current shape of the creative marketplace.</p>
      </header>

      <div className="admin-stat-grid">
        {statistics.map((statistic) => (
          <article
            key={statistic.label}
            className={`admin-stat ${statistic.accent}`}
          >
            <span>{statistic.label}</span>
            <strong>{String(statistic.value).padStart(2, "0")}</strong>
          </article>
        ))}
      </div>

      <section className="admin-recent-listings">
        <div className="admin-section-heading">
          <p className="eyebrow">Latest in the catalogue</p>
          <h2>Recent listings.</h2>
        </div>
        <div className="admin-listing-table">
          {products.slice(0, 6).map((product) => {
            const creator = creators.find(
              (item) => item.id === product.creatorId,
            );
            const price =
              product.type === "commission"
                ? `From ${formatPrice(product.priceFrom)}`
                : formatPrice(product.price);

            return (
              <article key={product.id} className="admin-listing-row">
                <img src={product.image} alt="" />
                <div>
                  <h3>{product.title}</h3>
                  <p>by {creator.name}</p>
                </div>
                <span className="admin-type">
                  {product.type === "commission" ? "Commission" : "Ready-made"}
                </span>
                <span className="admin-category">{product.category}</span>
                <strong>{price}</strong>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
