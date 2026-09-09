import { notFound } from "next/navigation";

import CollectionsClient from "../../../components/collections/CollectionsClient";
import {
  COLLECTION_CATEGORIES,
  getCategoryBySlug,
} from "@/lib/collections";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return COLLECTION_CATEGORIES.filter((category) => category.slug).map(
    (category) => ({
      category: category.slug,
    })
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: `${category.label} | NIRA Haute Living`,
    description: `Explore NIRA's ${category.label.toLowerCase()} collection.`,
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category || !category.slug) {
    notFound();
  }

  return <CollectionsClient initialCategory={category.value} />;
}
