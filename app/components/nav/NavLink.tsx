import { NavLink as RouterNavLink } from "react-router";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export function NavLink({ to, children }: NavLinkProps) {
  const base = "text-sm font-medium transition-colors duration-200 no-underline";

  if (to.startsWith("#")) {
    return (
      <a href={to} className={`${base} text-white/75 hover:text-white`}>
        {children}
      </a>
    );
  }

  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `${base} ${isActive ? "text-white" : "text-white/75 hover:text-white"}`
      }
    >
      {children}
    </RouterNavLink>
  );
}
