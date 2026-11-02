import { Link } from "react-router-dom";
export default function CreatorCard({ creator }) {
  return (
    <Link to={`/creator/${creator.id}`} className="creator-card">
      <div className="creator-photo">
        <img
          src={creator.avatar}
          alt={`${creator.name}, fictional creator profile`}
        />
        <span>{creator.works} works</span>
      </div>
      <div>
        <h3>{creator.name}</h3>
        <p>{creator.role}</p>
      </div>
    </Link>
  );
}
