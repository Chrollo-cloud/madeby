import { useMarketplace } from "../../hooks/useMarketplace";
import ProductGrid from "../../components/product/ProductGrid";
import EmptyState from "../../components/ui/EmptyState";
import "./saved.css";
export default function Saved() {
  const { savedProducts } = useMarketplace();
  return (
    <div className="saved page">
      <header className="saved-header">
        <p className="eyebrow">Your collection</p>
        <h1>
          Saved <i>works</i>
          <span>.</span>
        </h1>
        <p>The things that made you pause.</p>
      </header>
      {savedProducts.length ? (
        <>
          <div className="result-row">
            <p>
              <b>{String(savedProducts.length).padStart(2, "0")}</b> saved works
            </p>
            <p>Keep collecting</p>
          </div>
          <ProductGrid products={savedProducts} />
        </>
      ) : (
        <EmptyState
          title="Nothing saved yet."
          text="Discover something worth keeping."
        />
      )}
    </div>
  );
}
