export interface Product {
  id: string;
  name: string;
  slug: string;

  category: string;
  subcategory?: string;

  shortDescription: string;
  description: string;

  images: string[];

  materials?: string[];
  fabrics?: string[];
  colors?: string[];

  dimensions?: {
    width?: string;
    depth?: string;
    height?: string;
  };

  customization?: string[];

  featured: boolean;
  active: boolean;

  seoTitle?: string;
  seoDescription?: string;
  altText?: string;

  createdAt: string;
  updatedAt: string;
}