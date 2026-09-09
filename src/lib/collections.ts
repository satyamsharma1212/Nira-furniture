export const COLLECTION_CATEGORIES = [
  {
    label: "All Pieces",
    value: "all",
    slug: "",
  },

  {
    label: "Bar Stools",
    value: "bar stools",
    slug: "bar-stools",
  },

  {
    label: "Console Table",
    value: "console table",
    slug: "console-table",
  },

  {
    label: "Dining Chairs",
    value: "dining chairs",
    slug: "dining-chairs",
  },

  {
    label: "Floating Trays",
    value: "floating trays",
    slug: "floating-trays",
  },

  {
    label: "Indoor Sofa Set",
    value: "indoor sofa set",
    slug: "indoor-sofa-set",
  },

  {
    label: "Our Work",
    value: "our work",
    slug: "our-work",
  },

  {
    label: "Outdoor Chairs",
    value: "outdoor chairs",
    slug: "outdoor-chairs",
  },

  {
    label: "Outdoor Sofa Set",
    value: "outdoor sofa set",
    slug: "outdoor-sofa-set",
  },

  {
    label: "Rocking Chairs",
    value: "rocking chairs",
    slug: "rocking-chairs",
  },

  {
    label: "Single Seater Sofa Indoor",
    value: "single seater sofa indoor",
    slug: "single-seater-sofa-indoor",
  },

  {
    label: "Sun Loungers",
    value: "sun loungers",
    slug: "sun-loungers",
  },

  {
    label: "Swings Indoor",
    value: "swings indoor",
    slug: "swings-indoor",
  },

  {
    label: "Swings Outdoor",
    value: "swings outdoor",
    slug: "swings-outdoor",
  },

  {
    label: "Umbrella",
    value: "umbrella",
    slug: "umbrella",
  },
] as const;

export type CollectionCategory =
  (typeof COLLECTION_CATEGORIES)[number]["value"];

export function getCategoryBySlug(slug?: string) {
  if (!slug) return COLLECTION_CATEGORIES[0];

  return (
    COLLECTION_CATEGORIES.find(
      (category) => category.slug === slug
    ) ?? null
  );
}

export const MATERIALS = [
  "All Materials",
  "Agora Fabric",
  "Teak Wood",
  "Ash Wood",
  "Jindal Stainless Steel",
  "Roping",
  "Synthetic Weaving",
  "Sleep Well Foam",
  "Powder Coating",
] as const;

export type MaterialFilter = (typeof MATERIALS)[number];