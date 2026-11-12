import { useEffect, useRef } from "react";
import "./BrandsSection.css";

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

const SILHOUETTE = new Set(["toyota", "audi", "volkswagen", "cupra", "jaguar", "nissan"]);

function Item({ slug, name, hidden }: { slug: string; name: string; hidden?: boolean }) {
  return (
    <li className={`brand-item${SILHOUETTE.has(slug) ? " brand-silhouette" : ""}`} aria-hidden={hidden || undefined}>
      <img
        src={`/logos/${slug}.webp`}
        alt={hidden ? "" : name}
        width={72}
        height={72}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span>{name}</span>
    </li>
  );
}

const LOOP_SECONDS = 70;

export function BrandsSection() {
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const velocity = useRef(0);
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
          velocity.current *= Math.pow(0.04, dt);
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
    velocity.current = -(dx / Math.max(1, now - lastT.current)) * 1000 * 0.6 + velocity.current * 0.4;
    lastX.current = e.clientX;
    lastT.current = now;
  };
  const endDrag = () => {
    dragging.current = false;
    if (performance.now() - lastT.current > 80) velocity.current = 0;
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const d = e.deltaX || (e.shiftKey ? e.deltaY : 0);
    if (d) offset.current += d;
  };

  return (
    <section className="brands relative overflow-hidden bg-[var(--brands-bg)] py-20">
      <div className="brands-head">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)]">Márkáink</span>
          <h2 className="mt-2 text-3xl font-black text-[var(--text-dark)] sm:text-4xl">
            Minden népszerű márka egy helyen
          </h2>
        </div>
        <p className="text-sm font-semibold text-[var(--brands-label)]">{BRANDS.length}+ gyártó kínálatából</p>
      </div>

      <div
        className="brands-strip"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") hovering.current = true; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hovering.current = false; }}
        onWheel={onWheel}
      >
        <div ref={track} className="brands-track">
          <ul className="brands-list">
            {BRANDS.map((b) => <Item key={b.slug} {...b} />)}
          </ul>
          <ul className="brands-list" aria-hidden="true">
            {BRANDS.map((b) => <Item key={b.slug} {...b} hidden />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
