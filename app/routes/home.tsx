import { lazy, Suspense } from "react";
import type { Route } from "./+types/home";
import { Page } from "../components/layout";
import { HeroSection } from "../components/sections/HeroSection";
import { fetchCars } from "../lib/api";

const FeaturedCarsSection = lazy(() =>
  import("../components/sections/FeaturedCarsSection").then((m) => ({ default: m.FeaturedCarsSection })),
);
const BrandsSection = lazy(() =>
  import("../components/sections/BrandsSection").then((m) => ({ default: m.BrandsSection })),
);
const ContactSection = lazy(() =>
  import("../components/sections/ContactSection").then((m) => ({ default: m.ContactSection })),
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reggin - Használtautó-Kereskedés" },
    { name: "description", content: "Megbízható használt autó kereskedés Miskolcon." },
  ];
}

export async function clientLoader() {
  return { cars: await fetchCars() };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <Page>
      <HeroSection />
      <Suspense fallback={<div aria-hidden className="relative z-20 min-h-screen bg-[var(--bg-light)]" />}>
        <FeaturedCarsSection cars={loaderData.cars.slice(0, 6)} />
        <BrandsSection />
        <ContactSection />
      </Suspense>
    </Page>
  );
}
