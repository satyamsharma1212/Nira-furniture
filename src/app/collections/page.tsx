import CollectionsClient from "../../components/collections/CollectionsClient";

export const metadata = {
  title: "Collections | NIRA Haute Living",
  description:
    "Explore NIRA's curated furniture collections, from indoor and outdoor furniture to seating, dining and sculptural accents.",
};

export default function CollectionsPage() {
  return <CollectionsClient initialCategory="all" />;
}
