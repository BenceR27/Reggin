import { useState } from "react";

const LOGO_BASE = "/logos";

// Dark logos that get turned white on the dark theme. All other logos keep their own colors.
export const SILHOUETTE = new Set(["toyota", "audi", "volkswagen", "cupra", "jaguar", "nissan"]);

const slugify = (brand: string) =>
  brand
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
    
export function BrandLogo({ brand, size = 24 }: { brand: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  const slug = slugify(brand);
  return (
    <img
      src={`${LOGO_BASE}/${slug}.webp`}
      alt=""
      aria-hidden
      decoding="async"
      width={size}
      height={size}
      className={`brand-logo${SILHOUETTE.has(slug) ? " brand-logo-silhouette" : ""} shrink-0 object-contain`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
