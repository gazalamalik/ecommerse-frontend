export interface ProductCategoryDto {
  id: number;
  imageUrl: string;
  altText: string;
  name: string;
}

export interface ProductDto {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  brand?: string;
  color?: string;
  discount?: number;
  rating?: number;
  description?: string;
  reviewCount?: number;
  imgeUrls: string[];
  quantity: number;
}

export interface ProductFiltersDto {
  categories: string[];
  brands: string[];
  colors: string[];
  discounts: number[];
  priceRange: { min: number; max: number };
}