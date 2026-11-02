import Button from "./Button";
export default function EmptyState({
  title = "Nothing here yet.",
  text = "Try a different search or explore the latest work.",
  action = true,
}) {
  return (
    <section className="empty-state">
      <span>✦</span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action && <Button to="/explore">Explore works →</Button>}
    </section>
  );
}
