import { Link } from "react-router-dom";
import { products } from "../../data/products";
import { creators } from "../../data/creators";
import ProductGrid from "../../components/product/ProductGrid";
import CreatorCard from "../../components/creator/CreatorCard";
import SectionTitle from "../../components/ui/SectionTitle";
import Button from "../../components/ui/Button";
import "./home.css";

export default function Home() {
  const readyMade = products
    .filter((product) => product.type === "product")
    .slice(0, 4);
  const commissions = products
    .filter((product) => product.type === "commission")
    .slice(0, 4);
  return (
    <div id="top" className="home page">
      <section className="hero">
        <p className="eyebrow">
          Independent student marketplace <span>✦</span>
        </p>
        <h1>
          MADE BY
          <br />
          STUDENTS<span>.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Things worth making.
            <br />
            Things worth discovering.
          </p>
          <Button to="/explore">
            Explore works <span>→</span>
          </Button>
        </div>
        <div className="hero-collage">
          <img
            src="/images/hero/hero.png"
            alt="Collage of student-made creative work"
          />
        </div>
      </section>
      <section className="content-section shop-section">
        <SectionTitle
          eyebrow="01 / Ready to own"
          title={
            <>
              Shop <i>ready-made</i>.
            </>
          }
          action={
            <Link className="text-link" to="/explore">
              Shop products →
            </Link>
          }
        />
        <ProductGrid products={readyMade} />
      </section>
      <section className="content-section commission-section">
        <SectionTitle
          eyebrow="02 / Need something just for you?"
          title={
            <>
              Commissions <i>open</i>.
            </>
          }
          action={
            <Link className="text-link" to="/explore">
              Explore commissions →
            </Link>
          }
        />
        <ProductGrid products={commissions} />
      </section>
      <section className="content-section">
        <SectionTitle
          eyebrow="03 / The people behind it"
          title={
            <>
              Featured
              <br />
              <i>creators</i>.
            </>
          }
          action={
            <Link className="text-link" to="/creator/maylin">
              Meet them all →
            </Link>
          }
        />
        <div className="creator-grid">
          {creators.slice(0, 4).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
      <section className="content-section category-section">
        <p className="eyebrow">04 / Browse your way</p>
        <h2>
          Explore by
          <br />
          <i>category</i>.
        </h2>
        <div className="category-list">
          {[
            "ART",
            "FASHION",
            "PHOTOGRAPHY",
            "DESIGN",
            "ACCESSORIES",
            "STICKERS",
            "DIGITAL",
          ].map((item, index) => (
            <Link key={item} to="/explore">
              {String(index + 1).padStart(2, "0")}
              <strong>{item}</strong>
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="cta">
        <p className="eyebrow">Got something to share?</p>
        <h2>
          Your work
          <br />
          belongs <i>here.</i>
        </h2>
        <Button to="/become-a-creator" variant="light">
          Become a creator →
        </Button>
      </section>
    </div>
  );
}
