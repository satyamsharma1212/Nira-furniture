export const furnitureCategories = [
  {
    name: "Outdoor Furniture",
    slug: "outdoor-furniture",
    description: "Designed to bring comfort and style to outdoor spaces.",
    subcategories: [
      { name: "Outdoor Sofas", slug: "outdoor-sofas" },
      { name: "1 Seater Lounge Chairs", slug: "1-seater-lounge-chairs" },
      { name: "2 Seater Sofas", slug: "2-seater-sofas" },
      { name: "3 Seater Sofas", slug: "3-seater-sofas" },
      { name: "L-Shaped Sofas", slug: "l-shaped-sofas" },
      { name: "Lounge Chairs", slug: "lounge-chairs" },
      { name: "Outdoor Dining Chairs", slug: "outdoor-dining-chairs" },
      { name: "Sun Loungers", slug: "sun-loungers" },
      { name: "Swings", slug: "swings" },
      { name: "Day Beds", slug: "day-beds" },
      { name: "Outdoor Tables", slug: "outdoor-tables" },
      { name: "Floating Trays", slug: "floating-trays" },
    ],
  },

  {
    name: "Indoor Furniture",
    slug: "indoor-furniture",
    description:
      "Elegant furniture designed for comfortable and sophisticated interiors.",
    subcategories: [
      { name: "Indoor Sofas", slug: "indoor-sofas" },
      { name: "1 Seater Sofas", slug: "1-seater-sofas" },
      { name: "2 Seater Sofas", slug: "2-seater-sofas" },
      { name: "3 Seater Sofas", slug: "3-seater-sofas" },
      { name: "L-Shaped Sofas", slug: "indoor-l-shaped-sofas" },
      { name: "Lounge Chairs", slug: "indoor-lounge-chairs" },
      { name: "Dining Chairs", slug: "dining-chairs" },
      { name: "Beds", slug: "beds" },
      { name: "Tables", slug: "indoor-tables" },
    ],
  },

  {
    name: "Custom Furniture",
    slug: "custom-furniture",
    description: "Your Space. Your Design. Your Furniture.",
    subcategories: [],
  },
] as const;