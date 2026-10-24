import { createContext, useContext, useEffect, useState } from "react";
import { products as demoProducts } from "../data/products";
import { creators as demoCreators } from "../data/creators";
import { API_BASE_URL, fetchCollection } from "../services/catalogue";

const CatalogueContext = createContext(null);

export function CatalogueProvider({ children }) {
  const [catalogue, setCatalogue] = useState({
    products: API_BASE_URL ? [] : demoProducts,
    creators: API_BASE_URL ? [] : demoCreators,
  });
  const [loading, setLoading] = useState(Boolean(API_BASE_URL));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!API_BASE_URL) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    Promise.all([
      fetchCollection("listings", controller.signal),
      fetchCollection("creators", controller.signal),
    ])
      .then(([products, creators]) => {
        if (!controller.signal.aborted) setCatalogue({ products, creators });
      })
      .catch((reason) => {
        if (!controller.signal.aborted) setError(reason.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <CatalogueContext.Provider value={catalogue}>
      {loading ? (
        <div className="page" role="status">
          Loading MADEBY catalogue…
        </div>
      ) : error ? (
        <div className="page" role="alert">
          <p>We couldn’t load the catalogue. {error}</p>
          <button onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </button>
        </div>
      ) : (
        children
      )}
    </CatalogueContext.Provider>
  );
}

export const useCatalogue = () => useContext(CatalogueContext);
