export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export async function fetchCollection(resource, signal) {
  const items = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await fetch(
      `${API_BASE_URL}/${resource}?per_page=100&page=${page}`,
      { signal, headers: { Accept: "application/json" } },
    );
    if (!response.ok)
      throw new Error(`Catalogue request failed (${response.status}).`);
    const body = await response.json();
    if (!Array.isArray(body.data))
      throw new Error("The catalogue response is invalid.");
    items.push(...body.data);
    lastPage = body.meta?.last_page ?? 1;
    page += 1;
  } while (page <= lastPage);

  return items;
}
