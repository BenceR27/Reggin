export function FooterBrand() {
  return (
    <div>
      <img
        src="/regginlogo.webp"
        alt="Reggin logo"
        width={106}
        height={40}
        loading="lazy"
        decoding="async"
        className="h-10 bg-white px-2 py-0.5 rounded-lg object-contain mb-4"
      />
      <p className="text-white/50 text-sm max-w-xs leading-relaxed">
        Megbízható használt autó kereskedés 
        <br/>
        2024 óta. 
      </p>
    </div>
  );
}
