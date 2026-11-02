import { Link } from "react-router-dom";
export default function Button({
  children,
  to,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = `button ${variant} ${className}`;
  return to ? (
    <Link className={classes} to={to}>
      {children}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
