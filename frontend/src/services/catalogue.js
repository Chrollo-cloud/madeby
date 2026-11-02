import apiClient from "../utils/apiClient";
export { API_BASE_URL } from "../utils/apiClient";
export async function fetchCollection(resource, signal) {
  const items = [];
  let page = 1;
  let lastPage = 1;
  do {
    const { data } = await apiClient.get(`/${resource}`, {
      signal,
      params: { per_page: 100, page },
    });
    if (!Array.isArray(data.data))
      throw new Error("The catalogue response is invalid.");
    items.push(...data.data);
    lastPage = data.meta?.last_page ?? 1;
    page++;
  } while (page <= lastPage);
  return items;
}
