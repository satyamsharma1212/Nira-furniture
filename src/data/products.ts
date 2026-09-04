import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Outdoor Lounge Sofa",
    slug: "outdoor-lounge-sofa",
    category: "Outdoor Furniture",
    subcategory: "Outdoor Sofas",
    shortDescription:
      "Contemporary outdoor seating crafted for comfort and durability.",
    description:
      "A premium outdoor lounge sofa designed for sophisticated terraces, patios, gardens, resorts and hospitality spaces.",
    images: ["/products/outdoor/lounge-sofa.jpg"],
    materials: ["Aluminium", "Synthetic Rattan & Wicker"],
    fabrics: ["Premium Outdoor Fabric"],
    colors: ["Natural", "Beige", "Charcoal"],
    customization: [
      "Custom Dimensions",
      "Custom Fabric",
      "Custom Colour",
      "Custom Cushion Configuration",
    ],
    featured: true,
    active: true,
    seoTitle:
      "Premium Outdoor Lounge Sofa Manufacturer in India | NIRA Furniture",
    seoDescription:
      "Explore premium outdoor lounge sofas by NIRA Furniture. Custom dimensions, fabrics and finishes available with Pan-India delivery.",
    altText: "Premium outdoor lounge sofa by NIRA Furniture",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "2",
    name: "Designer Outdoor Lounge Chair",
    slug: "designer-outdoor-lounge-chair",
    category: "Outdoor Furniture",
    subcategory: "Lounge Chairs",
    shortDescription:
      "Elegant outdoor lounge seating combining contemporary design and comfort.",
    description:
      "A sophisticated lounge chair designed for premium outdoor residential and hospitality environments.",
    images: ["/products/outdoor/lounge-chair.jpg"],
    materials: ["Aluminium", "Marine Rope"],
    fabrics: ["Premium Outdoor Fabric"],
    colors: ["Sand", "Black", "Natural"],
    customization: [
      "Custom Dimensions",
      "Custom Rope",
      "Custom Fabric",
      "Custom Colour",
    ],
    featured: true,
    active: true,
    seoTitle:
      "Designer Outdoor Lounge Chair Manufacturer | NIRA Furniture",
    seoDescription:
      "Premium custom outdoor lounge chairs manufactured by NIRA Furniture in India.",
    altText: "Designer outdoor lounge chair by NIRA Furniture",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "3",
    name: "Luxury Outdoor Day Bed",
    slug: "luxury-outdoor-day-bed",
    category: "Outdoor Furniture",
    subcategory: "Day Beds",
    shortDescription:
      "Relaxed luxury for resorts, terraces and private outdoor spaces.",
    description:
      "A premium outdoor day bed created for luxurious relaxation and contemporary outdoor environments.",
    images: ["/products/outdoor/day-bed.jpg"],
    materials: ["Aluminium", "Synthetic Rattan & Wicker"],
    fabrics: ["Premium Outdoor Fabric"],
    colors: ["Natural", "Cream"],
    customization: [
      "Custom Dimensions",
      "Custom Fabric",
      "Custom Colour",
    ],
    featured: true,
    active: true,
    seoTitle:
      "Luxury Outdoor Day Bed Manufacturer in India | NIRA Furniture",
    seoDescription:
      "Discover luxury custom outdoor day beds manufactured by NIRA Furniture for resorts, hotels and residences.",
    altText: "Luxury outdoor day bed by NIRA Furniture",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "4",
    name: "Contemporary Indoor Sofa",
    slug: "contemporary-indoor-sofa",
    category: "Indoor Furniture",
    subcategory: "Indoor Sofas",
    shortDescription:
      "Sophisticated indoor seating designed for contemporary interiors.",
    description:
      "A refined indoor sofa designed to bring comfort, elegance and character to premium residential and commercial interiors.",
    images: ["/products/indoor/indoor-sofa.jpg"],
    materials: ["Teak Wood", "Mild Steel"],
    fabrics: ["Premium Indoor Fabric"],
    colors: ["Ivory", "Beige", "Taupe"],
    customization: [
      "Custom Dimensions",
      "Custom Fabric",
      "Custom Colour",
      "Cushion Configuration",
    ],
    featured: true,
    active: true,
    seoTitle:
      "Premium Indoor Sofa Manufacturer in India | NIRA Furniture",
    seoDescription:
      "Premium custom indoor sofas by NIRA Furniture, manufactured in India with custom fabrics, dimensions and finishes.",
    altText: "Premium contemporary indoor sofa by NIRA Furniture",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];