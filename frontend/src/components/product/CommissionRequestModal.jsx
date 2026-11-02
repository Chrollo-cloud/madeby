import { useState } from "react";

export default function CommissionRequestModal({ product, onClose }) {
  const [sent, setSent] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="commission-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close request form"
        >
          ×
        </button>
        {sent ? (
          <div className="request-success">
            <span>✦</span>
            <h2>Request sent ✓</h2>
            <p>
              {product.creatorId === "mira"
                ? "Mira will be in touch about your shoot."
                : "Your creator will be in touch about your idea."}
            </p>
            <button className="button primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Commission request</p>
            <h2 id="request-title">
              Let’s make
              <br />
              <i>something.</i>
            </h2>
            <p className="modal-intro">
              Send {product.title} details to your creator. This is a demo
              request. Nothing is sent externally.
            </p>
            <form onSubmit={submit}>
              <label>
                Name
                <input required name="name" />
              </label>
              <label>
                Email
                <input required type="email" name="email" />
              </label>
              <label>
                What would you like?
                <textarea
                  required
                  name="request"
                  rows="3"
                  placeholder="Tell them about your idea..."
                />
              </label>
              <label>
                Additional notes
                <textarea name="notes" rows="2" />
              </label>
              <label>
                Preferred deadline
                <input name="deadline" placeholder="e.g. 15 November" />
              </label>
              <button className="button primary" type="submit">
                Send request →
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
