import "./admin.css";

const technologies = [
  "React",
  "React Router",
  "JavaScript / JSX",
  "CSS",
  "Context API",
  "useState",
];

export default function AboutPage() {
  return (
    <section className="admin-page admin-about">
      <header className="admin-page-header">
        <p className="eyebrow">MADEBY / ADMIN</p>
        <h1>
          About<span>.</span>
        </h1>
      </header>

      <article className="admin-about-card">
        <p className="eyebrow">MADEBY</p>
        <h2>Made by students. Worth discovering.</h2>
        <p>
          MADEBY is a creative marketplace for university students. Creators can
          share ready-made work, offer commissions, and find people who want to
          support what they make.
        </p>
      </article>

      <section className="admin-tech">
        <p className="eyebrow">Prototype information</p>
        <div>
          {technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>
    </section>
  );
}
