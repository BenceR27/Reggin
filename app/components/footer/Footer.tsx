import { FooterBrand } from "./FooterBrand";
import { FooterLinkGroup } from "./FooterLinkGroup";
import { FooterBottom } from "./FooterBottom";

const NAV_LINKS = [
  { label: "Főoldal",        href: "/" },
  { label: "Kínálatunk",     href: "/#autok" },
  { label: "Finanszírozás",  href: "#" },
  { label: "Rólunk",         href: "#" },
  { label: "Kapcsolat",      href: "/#kapcsolat" },
];

const CONTACT_ITEMS = [
  { label: "3525 Miskolc" },
  { label: "Palóczy László utca 3." },
  { label: "+36 1 234 5678" },
  { label: "info@reggin.hu" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] pt-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 mb-10">
          <FooterBrand />
          <FooterLinkGroup title="Navigáció" items={NAV_LINKS} />
          <FooterLinkGroup title="Elérhetőség" items={CONTACT_ITEMS} />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
