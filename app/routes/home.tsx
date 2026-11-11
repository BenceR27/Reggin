import type { Route } from "./+types/home";
import { Page } from "../components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reggin - Használtautó-Kereskedés" },
    { name: "description", content: "Megbízható használt autó kereskedés Miskolcon." },
  ];
}

export default function Home() {
  return (
    <Page>
      <div className="min-h-screen" />
    </Page>
  );
}
