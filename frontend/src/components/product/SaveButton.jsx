import { useMarketplace } from "../../hooks/useMarketplace";
export default function SaveButton({ product }) {
  const { isSaved, toggleSaved } = useMarketplace();
  const saved = isSaved(product.id);
  return (
    <button
      className={`save-button ${saved ? "saved" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(product);
      }}
      aria-label={
        saved ? `Remove ${product.title} from saved` : `Save ${product.title}`
      }
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
