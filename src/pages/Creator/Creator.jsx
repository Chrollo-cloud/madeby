import { useParams } from "react-router-dom";
import { useState } from "react";
import { creators } from "../../data/creators";
import { products } from "../../data/products";
import ProductGrid from "../../components/product/ProductGrid";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import "./creator.css";

export default function Creator() {
  const { id } = useParams();
  const creator = creators.find((item) => item.id === id);
  const [following, setFollowing] = useState(false);
  if (!creator) return <EmptyState title="Creator not found." />;
  const readyWorks = products.filter(
    (product) => product.creatorId === id && product.type === "product",
  );
  const commissions = products.filter(
    (product) => product.creatorId === id && product.type === "commission",
  );
  return (
    <div className="creator page">
      <section className="creator-hero">
        <div className="creator-portrait">
          <img
            src={creator.avatar}
            alt={`${creator.name}, fictional creator profile`}
          />
        </div>
        <div className="creator-bio">
          <p className="eyebrow">
            Creator profile / 0{creators.indexOf(creator) + 1}
          </p>
          <h1>
            {creator.name}
            <span>.</span>
          </h1>
          <p className="creator-role">
            {creator.role} · {creator.location}
          </p>
          <p className="bio">{creator.bio}</p>
          <Button
            onClick={() => setFollowing(!following)}
            variant={following ? "light" : "primary"}
          >
            {following ? "Following ✓" : "Follow +"}
          </Button>
        </div>
        <dl className="creator-stats">
          <div>
            <dt>{creator.followers}</dt>
            <dd>followers</dd>
          </div>
          <div>
            <dt>{creator.works}</dt>
            <dd>listings</dd>
          </div>
          <div>
            <dt>{creator.likes}</dt>
            <dd>likes</dd>
          </div>
        </dl>
      </section>
      {readyWorks.length > 0 && (
        <section className="latest">
          <p className="eyebrow">Ready to own</p>
          <h2>
            Available <i>work</i>.
          </h2>
          <ProductGrid products={readyWorks} />
        </section>
      )}
      {commissions.length > 0 && (
        <section className="latest commissions">
          <p className="eyebrow">Made just for you</p>
          <h2>
            Commissions <i>open</i>.
          </h2>
          <ProductGrid products={commissions} />
        </section>
      )}
    </div>
  );
}
