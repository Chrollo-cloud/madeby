export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="filters" aria-label="Product categories">
      {categories.map((category) => (
        <button
          key={category}
          className={active === category ? "active" : ""}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
