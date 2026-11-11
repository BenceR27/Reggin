import { useEffect, useRef } from "react";

const BRANDS = [
  { slug: "abarth",        name: "Abarth" },
  { slug: "alfa-romeo",    name: "Alfa Romeo" },
  { slug: "audi",          name: "Audi" },
  { slug: "bmw",           name: "BMW" },
  { slug: "citroen",       name: "Citroën" },
  { slug: "cupra",         name: "Cupra" },
  { slug: "dacia",         name: "Dacia" },
  { slug: "ds",            name: "DS" },
  { slug: "fiat",          name: "Fiat" },
  { slug: "ford",          name: "Ford" },
  { slug: "honda",         name: "Honda" },
  { slug: "hyundai",       name: "Hyundai" },
  { slug: "infiniti",      name: "Infiniti" },
  { slug: "jaguar",        name: "Jaguar" },
  { slug: "jeep",          name: "Jeep" },
  { slug: "kia",           name: "Kia" },
  { slug: "land-rover",    name: "Land Rover" },
  { slug: "lexus",         name: "Lexus" },
  { slug: "mazda",         name: "Mazda" },
  { slug: "mercedes-benz", name: "Mercedes-Benz" },
  { slug: "mg",            name: "MG" },
  { slug: "mini",          name: "MINI" },
  { slug: "mitsubishi",    name: "Mitsubishi" },
  { slug: "nissan",        name: "Nissan" },
  { slug: "opel",          name: "Opel" },
  { slug: "peugeot",       name: "Peugeot" },
  { slug: "porsche",       name: "Porsche" },
  { slug: "renault",       name: "Renault" },
  { slug: "seat",          name: "SEAT" },
  { slug: "skoda",         name: "Škoda" },
  { slug: "smart",         name: "Smart" },
  { slug: "ssangyong",     name: "SsangYong" },
  { slug: "subaru",        name: "Subaru" },
  { slug: "suzuki",        name: "Suzuki" },
  { slug: "tesla",         name: "Tesla" },
  { slug: "toyota",        name: "Toyota" },
  { slug: "volkswagen",    name: "Volkswagen" },
  { slug: "volvo",         name: "Volvo" },
];

const TRACK = [...BRANDS, ...BRANDS];
const LOOP_SECONDS = 75; // one full pass over the brand list, same pace as the original CSS ticker

function BrandTag({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 cursor-pointer select-none group">
      <div className="glass-tile w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
        <img
          src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${slug}.png`}
          alt={name}
          draggable={false}
          className="relative w-12 h-12 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        />
      </div>
      <span className="text-[rgba(255,255,255,0.5)] font-semibold text-xs tracking-wider whitespace-nowrap group-hover:text-white transition-colors duration-200">
        {name}
      </span>
    </div>
  );
}

export function BrandsSection() {
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0); // px the track is shifted left; wraps every half-width (one copy of the list)
  const velocity = useRef(0); // px/s of manual "throw" momentum
  const hovering = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastT = useRef(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        let move = 0;
        if (!dragging.current) {
          move += velocity.current * dt;
          velocity.current *= Math.pow(0.04, dt); // momentum decays in ~1s
          if (Math.abs(velocity.current) < 8) velocity.current = 0;
          if (!hovering.current && velocity.current === 0) move += (half / LOOP_SECONDS) * dt;
        }
        offset.current = (((offset.current + move) % half) + half) % half;
        el.style.transform = `translate3d(${-offset.current}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    velocity.current = 0;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = e.clientX - lastX.current;
    offset.current -= dx;
    const dtMs = Math.max(1, now - lastT.current);
    velocity.current = -(dx / dtMs) * 1000 * 0.6 + velocity.current * 0.4;
    lastX.current = e.clientX;
    lastT.current = now;
  };
  const endDrag = () => {
    dragging.current = false;
    if (performance.now() - lastT.current > 80) velocity.current = 0; // held still before release: no throw
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const d = e.deltaX || (e.shiftKey ? e.deltaY : 0);
    if (d) offset.current += d;
  };

  return (
    <section className="py-20 bg-[var(--brands-bg)] overflow-hidden relative">
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <style>{`
        .brands-scroller { touch-action: pan-y; cursor: grab; }
        .brands-scroller:active { cursor: grabbing; }

        /* Liquid glass tile */
        .glass-tile {
          position: relative;
          background: var(--logo-chip);
          -webkit-backdrop-filter: blur(14px) saturate(1.9) brightness(1.15);
          backdrop-filter: blur(14px) saturate(1.9) brightness(1.15);
          backdrop-filter: url(#liquid-glass) blur(6px) saturate(1.9) brightness(1.15);
          box-shadow: var(--logo-glass-shadow);
        }
        /* bright refractive rim: light catches top-left and bottom-right edges */
        .glass-tile::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: var(--logo-rim);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          pointer-events: none;
        }
        /* specular highlight */
        .glass-tile::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--logo-sheen);
          pointer-events: none;
        }
      `}</style>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-[var(--primary)] opacity-[0.12] blur-[90px]" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full bg-[var(--secondary)] opacity-20 blur-[70px]" />
      </div>

      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="brands-scroller select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={(e) => { if (e.pointerType === "mouse") hovering.current = true; }}
          onPointerLeave={(e) => { if (e.pointerType === "mouse") hovering.current = false; }}
          onWheel={onWheel}
        >
          <div ref={track} className="flex w-max gap-3 will-change-transform">
            {TRACK.map((brand, i) => (
              <BrandTag key={i} slug={brand.slug} name={brand.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
