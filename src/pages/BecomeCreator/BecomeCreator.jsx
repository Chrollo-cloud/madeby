import { useState } from "react";
import Button from "../../components/ui/Button";
import "./become-creator.css";

const initialForm = {
  name: "",
  email: "",
  category: "ART",
  work: "",
  portfolio: "",
  listingType: "product",
  description: "",
};

export default function BecomeCreator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="become-creator page">
        <section className="creator-invite creator-success">
          <span className="invite-star" aria-hidden="true">
            ✦
          </span>
          <p className="eyebrow">Submission received</p>
          <h1>
            Thanks!
            <br />
            Your work has been <i>submitted.</i>
          </h1>
          <p className="invite-copy">
            We’re excited to see what you make, {form.name || "creator"}.
          </p>
          <Button to="/explore">Browse MADEBY →</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="become-creator page">
      <section className="creator-invite">
        <p className="eyebrow">For student creators</p>
        <span className="invite-star" aria-hidden="true">
          ✦
        </span>
        <h1>
          Your work
          <br />
          belongs <i>here.</i>
        </h1>
        <p className="invite-copy">
          Share what you make, offer your work, and become part of MADEBY.
        </p>
      </section>

      <form className="creator-form" onSubmit={submitForm}>
        <label>
          Name
          <input
            required
            name="name"
            value={form.name}
            onChange={updateField}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
          />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={updateField}>
            <option>ART</option>
            <option>FASHION</option>
            <option>PHOTOGRAPHY</option>
            <option>DESIGN</option>
            <option>ACCESSORIES</option>
            <option>STICKERS</option>
            <option>DIGITAL</option>
          </select>
        </label>
        <label>
          What do you create?
          <input
            required
            name="work"
            value={form.work}
            onChange={updateField}
            placeholder="e.g. risograph prints, photo sessions..."
          />
        </label>
        <label>
          Portfolio / Instagram
          <input
            required
            name="portfolio"
            value={form.portfolio}
            onChange={updateField}
            placeholder="@yourhandle or a link"
          />
        </label>
        <fieldset>
          <legend>Product or commission?</legend>
          <label className="radio-option">
            <input
              type="radio"
              name="listingType"
              value="product"
              checked={form.listingType === "product"}
              onChange={updateField}
            />
            Ready-made product
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="listingType"
              value="commission"
              checked={form.listingType === "commission"}
              onChange={updateField}
            />
            Creative commission
          </label>
        </fieldset>
        <label className="form-wide">
          Description
          <textarea
            required
            name="description"
            value={form.description}
            onChange={updateField}
            rows="5"
            placeholder="Tell us a little about your work and what you’d like to share."
          />
        </label>
        <div className="form-wide">
          <Button type="submit">Submit your work →</Button>
        </div>
      </form>
    </div>
  );
}
