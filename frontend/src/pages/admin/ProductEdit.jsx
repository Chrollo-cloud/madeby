import { useEffect } from "react";
import toast from "react-hot-toast";
import { apiError } from "../../utils/apiClient";
import { useParams, Link } from "react-router-dom";
import { useListing } from "../../utils/ProductContext";
import ProductForm from "./ProductForm";
export default function ProductEdit() {
  const { id } = useParams();
  const query = useListing(id);
  useEffect(() => {
    if (query.error)
      toast.error(`Unable to load listing. ${apiError(query.error)}`, {
        id: `listing-load-${id}`,
      });
  }, [id, query.error]);
  if (query.isPending)
    return (
      <p className="admin-page" role="status">
        Loading listing…
      </p>
    );
  if (query.isError)
    return (
      <div className="admin-page" role="alert">
        Unable to load listing.{" "}
        <button onClick={() => query.refetch()}>Retry</button>{" "}
        <Link to="/admin/dashboard">Back to dashboard</Link>
      </div>
    );
  return <ProductForm key={query.data.id} listing={query.data} />;
}
