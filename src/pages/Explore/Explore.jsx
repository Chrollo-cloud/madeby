import { useMemo, useState } from "react";
import { products } from "../../data/products";
import { creators } from "../../data/creators";
import { categories } from "../../data/categories";
import ProductGrid from "../../components/product/ProductGrid";
import SearchBar from "../../components/filter/SearchBar";
import CategoryFilter from "../../components/filter/CategoryFilter";
import EmptyState from "../../components/ui/EmptyState";
import "./explore.css";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [listingType, setListingType] = useState("ALL");
  const [sort, setSort] = useState("latest");
  const filtered = useMemo(
    () =>
      products
        .filter((product) => {
          const creator = creators.find(
            (item) => item.id === product.creatorId,
          );
          const text = [
            product.title,
            product.category,
            creator?.name,
            ...product.tags,
          ]
            .join(" ")
            .toLowerCase();
          return (
            (category === "ALL" || product.category === category) &&
            (listingType === "ALL" || product.type === listingType) &&
            text.includes(search.toLowerCase())
          );
        })
        .sort((a, b) =>
          sort === "low"
            ? (a.price ?? a.priceFrom) - (b.price ?? b.priceFrom)
            : sort === "high"
              ? (b.price ?? b.priceFrom) - (a.price ?? a.priceFrom)
              : b.rating - a.rating,
        ),
    [search, category, listingType, sort],
  );
  return (
    <div className="explore page">
      <header className="page-header">
        <p className="eyebrow">An ever-growing student shelf</p>
        <h1>
          Explore<span>.</span>
        </h1>
        <p>
          Find something
          <br />
          <i>made by someone.</i>
        </p>
      </header>
      <div className="browse-controls">
        <SearchBar value={search} onChange={setSearch} />
        <label className="sort">
          Sort{" "}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="latest">Trending</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="listing-filter" aria-label="Listing type">
        <button
          className={listingType === "ALL" ? "active" : ""}
          onClick={() => setListingType("ALL")}
        >
          All
        </button>
        <button
          className={listingType === "product" ? "active" : ""}
          onClick={() => setListingType("product")}
        >
          Products
        </button>
        <button
          className={listingType === "commission" ? "active" : ""}
          onClick={() => setListingType("commission")}
        >
          Commissions
        </button>
      </div>
      <CategoryFilter
        categories={categories}
        active={category}
        onChange={setCategory}
      />
      <div className="result-row">
        <p>
          <b>{String(filtered.length).padStart(2, "0")}</b> listings found
        </p>
        <p>Selected with curiosity</p>
      </div>
      {filtered.length ? (
        <ProductGrid products={filtered} />
      ) : (
        <EmptyState
          title="No listings found."
          text="Try loosening your search or picking another filter."
        />
      )}
    </div>
  );
}
