import { useState } from "react";

const LOGO_BASE = "/logos";

// "Mercedes-Benz" -> "mercedes-benz", "Škoda" -> "skoda", "Land Rover" -> "land-rover"
const slugify = (brand: string) =>
  brand
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
    
// renders nothing if the logo fails to load
export function BrandLogo({ brand, size = 24 }: { brand: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={`${LOGO_BASE}/${slugify(brand)}.webp`}
      alt=""
      aria-hidden
      decoding="async"
      width={size}
      height={size}
      className="brand-logo shrink-0 object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
