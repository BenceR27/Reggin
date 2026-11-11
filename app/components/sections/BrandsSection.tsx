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

function BrandTag({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 cursor-pointer select-none group">
      <img
        src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${slug}.png`}
        alt={name}
        className="w-12 h-12 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
      />
      <span className="text-[rgba(255,255,255,0.5)] font-semibold text-xs tracking-wider whitespace-nowrap group-hover:text-white transition-colors duration-200">
        {name}
      </span>
    </div>
  );
}

export function BrandsSection() {
  return (
    <section className="py-20 bg-[var(--footer-bg)] overflow-hidden relative">
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brands-track { animation: ticker 75s linear infinite; }
        .brands-track:hover { animation-play-state: paused; }
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
        <div className="brands-track flex w-max gap-3">
          {TRACK.map((brand, i) => (
            <BrandTag key={i} slug={brand.slug} name={brand.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
