import { Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

export function NavActions() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Link
        to="/belepes"
        className="flex items-center gap-2 text-sm font-medium text-white/80 border border-white/20 px-4 py-2 rounded-lg hover:text-white hover:border-white/40 transition-colors no-underline"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Bejelentkezés
      </Link>
      <Link
        to="/auto-eladas"
        className="text-sm font-semibold text-white bg-[var(--primary-btn)] px-4 py-2 rounded-lg hover:bg-[var(--primary-btn-hover)] transition-colors no-underline"
      >
        Autó eladása
      </Link>
    </div>
  );
}
