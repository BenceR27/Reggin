import { useState, useMemo } from "react";
import type { Route } from "./+types/home";
import { Page } from "../components/layout";
import {
  HeroSection,
  FeaturedCarsSection,
  BrandsSection,
  ContactSection,
} from "../components/sections";
import type { SearchState } from "../components/sections/HeroSection";
import type { PillFilter } from "../components/sections/FeaturedCarsSection";
import { CARS, matchesPrice } from "../components/sections/carsData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reggin - Használtautó-Kereskedés" },
    { name: "description", content: "Megbízható használt autó kereskedés Miskolcon." },
  ];
}

export default function Home() {
  const [search, setSearch] = useState<SearchState>({
    brand: "Minden márka",
    fuel: "Minden",
    price: "Minden",
  });
  const [pillFilter, setPillFilter] = useState<PillFilter>("Összes");

  const filteredCars = useMemo(() => {
    return CARS.filter((car) => {
      if (search.brand !== "Minden márka" && car.brand !== search.brand) return false;
      if (search.fuel !== "Minden" && car.fuel !== search.fuel) return false;
      if (!matchesPrice(car.priceM, search.price)) return false;
      if (pillFilter !== "Összes" && car.fuel !== pillFilter) return false;
      return true;
    });
  }, [search, pillFilter]);

  return (
    <Page>
      <HeroSection
        search={search}
        onChange={(next) => setSearch((prev) => ({ ...prev, ...next }))}
      />
      <FeaturedCarsSection
        cars={filteredCars}
        pillFilter={pillFilter}
        onPillFilter={setPillFilter}
      />
      <BrandsSection />
      <ContactSection />
    </Page>
  );
}
