import { useState } from "react";
import { motion } from "framer-motion";
import { NavLogo } from "./NavLogo";
import { NavLink } from "./NavLink";
import { NavActions } from "./NavActions";

const NAV_LINKS = [
  { label: "Főoldal",   to: "/" },
  { label: "Autóink",   to: "/#autok" },
  { label: "Rólunk",    to: "/#rolunk" },
  { label: "Importálás", to: "/importalas" },
  { label: "Tárolás",   to: "/tarolas" },
  { label: "Kapcsolat", to: "/#kapcsolat" },
];

// the drop-in only plays on the first load, not on every client-side navigation
let introPlayed = false;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateIn] = useState(() => !introPlayed);
  if (typeof window !== "undefined") introPlayed = true; // never flip it during SSR

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--header-bg)] shadow-[var(--shadow-nav)]"
      initial={animateIn ? { y: "-100%" } : false}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <NavLogo />

        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex">
          <NavActions />
        </div>

        <button
          className="md:hidden text-white p-2"
          aria-label="Menü megnyitása"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[var(--header-bg)] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/10">
            <NavActions />
          </div>
        </div>
      )}
    </motion.header>
  );
}
