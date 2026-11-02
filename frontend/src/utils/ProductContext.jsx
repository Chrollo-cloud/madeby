import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient, { apiError } from "./apiClient";
import { fetchCollection } from "../services/catalogue";
const ProductContext = createContext(null);
export const useListings = (params = {}) =>
  useQuery({
    queryKey: ["listings", "page", params],
    queryFn: async ({ signal }) =>
      (await apiClient.get("/listings", { params, signal })).data,
  });
export const useListing = (id) =>
  useQuery({
    queryKey: ["listings", "detail", id],
    queryFn: async ({ signal }) =>
      (await apiClient.get(`/listings/${encodeURIComponent(id)}`, { signal }))
        .data.data,
    enabled: Boolean(id),
  });
export function ProductProvider({ children }) {
  const client = useQueryClient();
  const listings = useQuery({
    queryKey: ["listings", "all"],
    queryFn: ({ signal }) => fetchCollection("listings", signal),
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCollection("categories", signal),
  });
  const creators = useQuery({
    queryKey: ["creators"],
    queryFn: ({ signal }) => fetchCollection("creators", signal),
  });
  const invalidate = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: ["listings"] }),
      client.invalidateQueries({ queryKey: ["creators"] }),
    ]);
  const options = (message) => ({
    onSuccess: async () => {
      await invalidate();
      toast.success(message);
    },
    onError: (error) => toast.error(apiError(error)),
  });
  const createListing = useMutation({
    mutationFn: async (data) =>
      (await apiClient.post("/listings", data)).data.data,
    ...options("Listing created."),
  });
  const updateListing = useMutation({
    mutationFn: async ({ id, data }) => {
      if (data instanceof FormData) {
        data.set("_method", "PATCH");
        return (
          await apiClient.post(`/listings/${encodeURIComponent(id)}`, data)
        ).data.data;
      }
      return (
        await apiClient.patch(`/listings/${encodeURIComponent(id)}`, data)
      ).data.data;
    },
    ...options("Listing updated."),
  });
  const deleteListing = useMutation({
    mutationFn: (id) => apiClient.delete(`/listings/${encodeURIComponent(id)}`),
    ...options("Listing deleted."),
  });
  return (
    <ProductContext.Provider
      value={{
        listings,
        categories,
        creators,
        createListing,
        updateListing,
        deleteListing,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
export const useProducts = () => useContext(ProductContext);
