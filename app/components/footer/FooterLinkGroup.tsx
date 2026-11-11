interface FooterItem {
  label: string;
  href?: string;
}

interface FooterLinkGroupProps {
  title: string;
  items: FooterItem[];
}

export function FooterLinkGroup({ title, items }: FooterLinkGroupProps) {
  return (
    <div>
      <p className="text-white text-sm font-bold mb-4">{title}</p>
      <ul className="flex flex-col gap-2 list-none p-0">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-white/50">
            {item.href ? (
              <a
                href={item.href}
                className="text-white/50 hover:text-[var(--primary)] transition-colors no-underline"
              >
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
