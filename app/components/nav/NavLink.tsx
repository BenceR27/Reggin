import { NavLink as RouterNavLink } from "react-router";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
}

export function NavLink({ to, children, active }: NavLinkProps) {
  const base = "text-sm font-medium transition-colors duration-200 no-underline";

  if (active !== undefined) {
    return (
      <RouterNavLink to={to} className={`${base} ${active ? "text-white" : "text-white/75 hover:text-white"}`}>
        {children}
      </RouterNavLink>
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
