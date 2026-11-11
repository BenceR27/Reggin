import { Link } from "react-router";

export function NavLogo() {
  return (
    <Link to="/" className="flex-shrink-0">
      <img
        src="/regginlogo.png"
        alt="Reggin logo"
        className="h-10 bg-white px-2 py-0.5 rounded-lg object-contain"
      />
    </Link>
  );
}
