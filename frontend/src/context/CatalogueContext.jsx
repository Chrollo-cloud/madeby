import { createContext, useContext } from "react";
import { products as demoProducts } from "../data/products";
import { creators as demoCreators } from "../data/creators";
import { categories as demoCategories } from "../data/categories";
import { useProducts } from "../utils/ProductContext";
const CatalogueContext = createContext(null);
export function CatalogueProvider({ children }) {
  const { listings, creators, categories } = useProducts();
  // Each request has an independent fallback; the original homepage and navigation stay visible.
  const value = {
    products: listings.data ?? demoProducts,
    creators: creators.data ?? demoCreators,
    categories: categories.data
      ? ["ALL", ...categories.data.map((c) => c.name)]
      : demoCategories,
    loading: listings.isPending || creators.isPending,
    error: listings.error || creators.error || categories.error,
  };
  return (
    <CatalogueContext.Provider value={value}>
      {value.loading && (
        <div className="catalogue-status" role="status">
          Loading live catalogue…
        </div>
      )}
      {value.error && (
        <div className="catalogue-status" role="alert">
          Some live catalogue data is unavailable. Showing cached or original
          MADEBY work.{" "}
          <button
            onClick={() => {
              listings.refetch();
              creators.refetch();
              categories.refetch();
            }}
          >
            Retry
          </button>
        </div>
      )}
      {children}
    </CatalogueContext.Provider>
  );
}
export const useCatalogue = () => useContext(CatalogueContext);
