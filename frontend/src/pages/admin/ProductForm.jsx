import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";
import "./admin.css";

export default function ProductForm({ listing }) {
  const navigate = useNavigate();
  const { categories, creators, createListing, updateListing } = useProducts();
  const [form, setForm] = useState(() => ({
    slug: listing?.slug ?? "",
    title: listing?.title ?? "",
    type: listing?.type ?? "product",
    category_id: listing?.category_id ?? "",
    creator_id: listing?.creator_id ?? "",
    description: listing?.description ?? "",
    price: listing?.price ?? "",
    price_from: listing?.priceFrom ?? "",
    stock: listing?.stock ?? "",
    commission_slots: listing?.commissionSlots ?? "",
    delivery_time: listing?.deliveryTime ?? "",
    tags: listing?.tags?.join(", ") ?? "",
  }));
  const [files, setFiles] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [errors, setErrors] = useState({});
  const mutation = listing ? updateListing : createListing;
  const update = (e) =>
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    const data = new FormData();
    const applicable =
      form.type === "product"
        ? ["price", "stock"]
        : ["price_from", "commission_slots", "delivery_time"];
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "tags" &&
        (![
          "price",
          "stock",
          "price_from",
          "commission_slots",
          "delivery_time",
        ].includes(key) ||
          applicable.includes(key))
      )
        data.append(key, value);
    });
    const tags = form.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (tags.length) tags.forEach((tag) => data.append("tags[]", tag));
    else data.append("tags", "");
    files.forEach((file) => data.append("images[]", file));
    removed.forEach((id) => data.append("remove_image_ids[]", id));
    try {
      await mutation.mutateAsync(listing ? { id: listing.id, data } : data);
      navigate("/admin/dashboard");
    } catch (error) {
      setErrors(
        error.response?.data?.errors ?? {
          request: [error.response?.data?.message || error.message],
        },
      );
    }
  };
  const messagesFor = (name) =>
    Object.entries(errors)
      .filter(([key]) => key === name || key.startsWith(`${name}.`))
      .flatMap(([, messages]) => messages);
  const errorProps = (name) => ({
    "aria-invalid": messagesFor(name).length > 0 || undefined,
    "aria-describedby": messagesFor(name).length ? `error-${name}` : undefined,
  });
  const fieldError = (name) =>
    messagesFor(name).length > 0 && (
      <span className="field-error" role="alert" id={`error-${name}`}>
        {messagesFor(name).join(" ")}
      </span>
    );
  const field = (name, label, type = "text") => (
    <label>
      {label}
      <input
        name={name}
        aria-label={label}
        {...errorProps(name)}
        type={type}
        value={form[name]}
        onChange={update}
        required={!["delivery_time", "tags"].includes(name)}
        min={type === "number" ? "0" : undefined}
        step={
          type === "number"
            ? name.includes("price")
              ? "0.01"
              : "1"
            : undefined
        }
      />
      {fieldError(name)}
    </label>
  );
  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <p className="eyebrow">MADEBY / ADMIN</p>
        <h1>
          {listing ? "Edit work" : "Add work"}
          <span>.</span>
        </h1>
      </header>
      {(categories.isError || creators.isError) && (
        <p role="alert">
          Unable to load categories or creators.{" "}
          <button
            onClick={() => {
              categories.refetch();
              creators.refetch();
            }}
          >
            Retry
          </button>
        </p>
      )}
      <form className="admin-form" onSubmit={submit}>
        {field("title", "Title")}
        {field("slug", "Slug")}
        <label>
          Listing type
          <select
            name="type"
            aria-label="Listing type"
            {...errorProps("type")}
            value={form.type}
            onChange={update}
          >
            <option value="product">Ready-made product</option>
            <option value="commission">Commission</option>
          </select>
          {fieldError("type")}
        </label>
        <label>
          Category
          <select
            required
            name="category_id"
            aria-label="Category"
            {...errorProps("category_id")}
            value={form.category_id}
            onChange={update}
          >
            <option value="">Select category</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldError("category_id")}
        </label>
        <label>
          Creator
          <select
            required
            name="creator_id"
            aria-label="Creator"
            {...errorProps("creator_id")}
            value={form.creator_id}
            onChange={update}
          >
            <option value="">Select creator</option>
            {creators.data?.map((c) => (
              <option key={c.id} value={c.databaseId}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldError("creator_id")}
        </label>
        {form.type === "product" ? (
          <>
            {field("price", "Price (IDR)", "number")}
            {field("stock", "Stock", "number")}
          </>
        ) : (
          <>
            {field("price_from", "Starting price (IDR)", "number")}
            {field("commission_slots", "Commission slots", "number")}
            {field("delivery_time", "Delivery time")}
          </>
        )}
        <label className="form-wide">
          Description
          <textarea
            name="description"
            aria-label="Description"
            {...errorProps("description")}
            required
            value={form.description}
            onChange={update}
            rows="5"
          />
          {fieldError("description")}
        </label>
        {field("tags", "Tags (comma separated)")}
        <label>
          Upload images (JPG, PNG, WebP; up to 10, 5 MB each)
          <input
            type="file"
            aria-label="Upload images (JPG, PNG, WebP; up to 10, 5 MB each)"
            {...errorProps("images")}
            required={!listing}
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          {fieldError("images")}
        </label>
        {listing?.gallery?.length > 0 && (
          <fieldset className="form-wide admin-gallery">
            <legend>Current gallery — select images to remove</legend>
            {listing.gallery.map((image) => (
              <label key={image.id}>
                <img src={image.url} alt="Current listing" />
                <span>
                  <input
                    type="checkbox"
                    checked={removed.includes(image.id)}
                    onChange={(e) =>
                      setRemoved((old) =>
                        e.target.checked
                          ? [...old, image.id]
                          : old.filter((id) => id !== image.id),
                      )
                    }
                  />{" "}
                  Remove
                </span>
              </label>
            ))}
          </fieldset>
        )}
        <div className="form-wide" aria-live="polite">
          {fieldError("remove_image_ids")}
          {fieldError("request")}
        </div>
        <button
          className="button primary"
          disabled={mutation.isPending || !categories.data || !creators.data}
        >
          {mutation.isPending ? "Saving…" : "Save listing →"}
        </button>
        <Link to="/admin/dashboard">Cancel</Link>
      </form>
    </section>
  );
}
