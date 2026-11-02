import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts, useListings } from "../../utils/ProductContext";
import { formatPrice } from "../../utils/formatPrice";
import "./admin.css";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const {
    listings,
    creators: creatorsQuery,
    categories,
    deleteListing,
  } = useProducts();
  const query = useListings({ search, category, type, page, per_page: 6 });
  const products = listings.data ?? [];
  const creators = creatorsQuery.data ?? [];
  const reset = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };
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
      {pendingDelete && (
        <div className="modal-backdrop">
          <section
            className="admin-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">Delete listing?</h2>
            <p>
              Remove “{pendingDelete.title}” and its uploaded images from the
              catalogue?
            </p>
            <div className="admin-actions">
              <button
                autoFocus
                disabled={deleteListing.isPending}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                disabled={deleteListing.isPending}
                onClick={() =>
                  deleteListing
                    .mutateAsync(pendingDelete.id)
                    .then(() => {
                      setPendingDelete(null);
                      if (query.data.data.length === 1 && page > 1)
                        setPage(page - 1);
                    })
                    .catch(() => {})
                }
              >
                {deleteListing.isPending ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </section>
        </div>
      )}

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
        <form
          className="admin-controls"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput);
            setPage(1);
            if (search === searchInput && page === 1) query.refetch();
          }}
        >
          <Link className="button light" to="/admin/listings/new">
            Add listing +
          </Link>
          <label>
            Search
            <input
              aria-label="Search listings"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>
          <label>
            Category
            <select value={category} onChange={reset(setCategory)}>
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select value={type} onChange={reset(setType)}>
              <option value="">All types</option>
              <option value="product">Ready-made</option>
              <option value="commission">Commission</option>
            </select>
          </label>
          <button type="submit" className="button light">
            Search
          </button>
        </form>
        {query.isPending && <p role="status">Loading database listings…</p>}
        {query.isError && (
          <p role="alert">
            Unable to load database listings.{" "}
            <button onClick={() => query.refetch()}>Retry</button>
          </p>
        )}
        {query.data?.data.length === 0 && (
          <p>No listings match these filters.</p>
        )}
        <div className="admin-listing-table">
          {(query.data?.data ?? []).map((product) => {
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
                  <p>
                    by{" "}
                    {product.creator?.name ??
                      creator?.name ??
                      product.creatorId}
                  </p>
                </div>
                <span className="admin-type">
                  {product.type === "commission" ? "Commission" : "Ready-made"}
                  <br />
                  {product.type === "commission"
                    ? `${product.commissionSlots} slots`
                    : `${product.stock} in stock`}
                </span>
                <span className="admin-category">{product.category}</span>
                <div>
                  <strong>{price}</strong>
                  <div className="admin-actions">
                    <Link to={`/admin/listings/${product.id}/edit`}>Edit</Link>
                    <button
                      disabled={deleteListing.isPending}
                      onClick={() => setPendingDelete(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="admin-pagination">
          <button
            disabled={page === 1 || query.isFetching}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {query.data?.meta.current_page ?? page} of{" "}
            {query.data?.meta.last_page ?? 1}
          </span>
          <button
            disabled={
              !query.data ||
              page >= query.data.meta.last_page ||
              query.isFetching
            }
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </section>
  );
}
