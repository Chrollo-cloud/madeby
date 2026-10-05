export default function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <span>⌕</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search works, creators, tags..."
        aria-label="Search works"
      />
    </label>
  );
}
