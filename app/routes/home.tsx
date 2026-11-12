import type { Route } from "./+types/home";
import { Page } from "../components/layout";
import {
  HeroSection,
  FeaturedCarsSection,
  BrandsSection,
  ContactSection,
} from "../components/sections";
import { CARS } from "../components/sections/carsData";

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
      <FeaturedCarsSection cars={CARS} />
      <BrandsSection />
      <ContactSection />
    </Page>
  );
}
