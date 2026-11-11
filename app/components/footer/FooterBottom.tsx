const LEGAL_LINKS = [
  { label: "Adatvédelmi nyilatkozat", href: "#" },
  { label: "ÁSZF", href: "#" },
  { label: "Sütik kezelése", href: "#" },
];

export function FooterBottom() {
  return (
    <div className="border-t border-white/10 py-6 flex flex-wrap justify-between items-center gap-4 text-white/30 text-xs">
      <p>© 2024 Reggin Használtautó-Kereskedés. Minden jog fenntartva.</p>
      <div className="flex gap-4">
        {LEGAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white/30 hover:text-white/60 transition-colors no-underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
