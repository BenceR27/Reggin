export type FuelType = "Dízel" | "Benzin" | "Hibrid" | "Elektromos";
export type BadgeColor = "green" | "navy" | "orange";

export interface Car {
  id: number;
  image: string;
  badge?: { text: string; color: BadgeColor };
  brand: string;
  model: string;
  year: number;
  km: string;
  fuel: FuelType;
  priceLabel: string;
  priceM: number;
}

export const CARS: Car[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1760713164476-7eb5063b3d07?w=600&h=400&fit=crop&auto=format",
    badge: { text: "Kiemelt", color: "green" },
    brand: "BMW",
    model: "5-ös sorozat 520d",
    year: 2021,
    km: "48 200 km",
    fuel: "Dízel",
    priceLabel: "12,9 M Ft",
    priceM: 12.9,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1763933356125-69476dc6eb5d?w=600&h=400&fit=crop&auto=format",
    badge: { text: "Új hirdetés", color: "navy" },
    brand: "Mercedes-Benz",
    model: "C 200 AMG Line",
    year: 2020,
    km: "62 500 km",
    fuel: "Benzin",
    priceLabel: "11,5 M Ft",
    priceM: 11.5,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1770172505111-9310d8f13bea?w=600&h=400&fit=crop&auto=format",
    brand: "Audi",
    model: "A6 40 TDI S tronic",
    year: 2022,
    km: "31 000 km",
    fuel: "Dízel",
    priceLabel: "14,2 M Ft",
    priceM: 14.2,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1692406069831-0bb7ea297645?w=600&h=400&fit=crop&auto=format",
    badge: { text: "Ár csökkent", color: "orange" },
    brand: "Volkswagen",
    model: "Passat 2.0 TDI Business",
    year: 2021,
    km: "55 800 km",
    fuel: "Dízel",
    priceLabel: "8,8 M Ft",
    priceM: 8.8,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1762026846208-946fe48e96e1?w=600&h=400&fit=crop&auto=format",
    badge: { text: "Kiemelt", color: "green" },
    brand: "Toyota",
    model: "RAV4 2.5 Hybrid AWD",
    year: 2023,
    km: "18 400 km",
    fuel: "Hibrid",
    priceLabel: "16,5 M Ft",
    priceM: 16.5,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1643142314913-0cf633d9bbb5?w=600&h=400&fit=crop&auto=format",
    brand: "Skoda",
    model: "Octavia 2.0 TDI Scout",
    year: 2020,
    km: "78 300 km",
    fuel: "Dízel",
    priceLabel: "7,0 M Ft",
    priceM: 7.0,
  },
];

export const ALL_BRANDS = "Minden márka";
export const ALL_FUELS = "Minden";
export const ALL_PRICES = "Minden";

// only brands that actually appear in the dataset
export const BRANDS = [
  ALL_BRANDS,
  ...[...new Set(CARS.map((c) => c.brand))].sort((a, b) => a.localeCompare(b)),
];

export const FUELS = ["Minden", "Benzin", "Dízel", "Hibrid", "Elektromos"];

// slider bounds in M Ft, derived from the data (rounded up to a whole million)
export const PRICE_MIN = 0;
export const PRICE_MAX = Math.ceil(Math.max(...CARS.map((c) => c.priceM)));

export function matchesPrice(priceM: number, range: string): boolean {
  if (range === "Minden") return true;
  if (range === "5M alatt") return priceM < 5;
  if (range === "5–10M Ft") return priceM >= 5 && priceM < 10;
  if (range === "10–15M Ft") return priceM >= 10 && priceM < 15;
  if (range === "15M felett") return priceM >= 15;
  return true;
}
