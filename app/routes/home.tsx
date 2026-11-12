import { lazy, Suspense } from "react";
import type { Route } from "./+types/home";
import { Page } from "../components/layout";
import { HeroSection } from "../components/sections/HeroSection";
import { CARS } from "../components/sections/carsData";

// below-the-fold sections are split into their own chunks so the first paint isn't waiting on them
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

export default function Home() {
  return (
    <Page>
      <HeroSection />
      <Suspense fallback={null}>
        <FeaturedCarsSection cars={CARS} />
        <BrandsSection />
        <ContactSection />
      </Suspense>
    </Page>
  );
}
